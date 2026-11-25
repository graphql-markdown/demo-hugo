import { basename, dirname, relative, resolve, sep } from "node:path";

import {
  fileExists,
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  readFile,
  saveFile,
} from "@graphql-markdown/utils";

import HugoFormatter from "@graphql-markdown/formatters/hugo";
import { toLink } from "@graphql-markdown/printer-legacy";

// Get the formatter object by calling createMDXFormatter or use the exports directly
const hugoFormatFunctions = typeof HugoFormatter.createMDXFormatter === 'function' 
  ? HugoFormatter.createMDXFormatter() 
  : HugoFormatter;

// Public URL of the generated pages' folder (site URL + base path + baseURL)
const COPIES_URL = "https://graphql-markdown.dev/demo-hugo/graphql";

// Pages render concurrently, so this may hold another page's options: only read
// settings shared by every page (schema, basePath, hierarchy, groups, deprecated, formatMDXLink).
let printOptions;

/**
 * Hook that captures the resolved print options before each page is printed.
 */
const beforePrintTypeHook = (event) => {
  printOptions = event.data.options;
};

/**
 * Replaces inline code names matching a schema type with a link to its page.
 */
const linkEntities = (text) => {
  const schema = printOptions?.schema;
  const rootTypes = [
    schema?.getQueryType(),
    schema?.getMutationType(),
    schema?.getSubscriptionType(),
  ];

  return text.replaceAll(/`([_A-Za-z][_0-9A-Za-z]*)`/g, (match, name) => {
    const type = schema?.getType(name);
    if (!type || name.startsWith("__") || rootTypes.includes(type)) {
      return match;
    }
    const { url } = toLink(type, name, undefined, printOptions);
    return url === "#" ? match : `[\`${name}\`](${url})`;
  });
};

/**
 * Formatter override that links entities in deprecation admonitions, whatever
 * the title case, so the `@deprecatedType` notices (titled "Deprecated") are
 * linked too.
 */
const formatMDXAdmonition = (admonition, meta) => {
  const text =
    admonition.title?.toLowerCase() === "deprecated" && admonition.text
      ? linkEntities(admonition.text)
      : admonition.text;
  return hugoFormatFunctions.formatMDXAdmonition({ ...admonition, text }, meta);
};

const COLUMNS_OPEN = "{{% columns %}}";
const COLUMNS_CLOSE = "{{% /columns %}}";
const indexWriteQueue = new Map();

const queueIndexUpdate = async (indexFilePath, update) => {
  const previous = indexWriteQueue.get(indexFilePath) ?? Promise.resolve();
  const next = previous
    .catch(() => {
      // Keep queue alive even if a previous update failed.
    })
    .then(update);

  indexWriteQueue.set(indexFilePath, next);
  return next;
};

/**
 * Hook that appends a link to the entity's page in the _index.md file
 * and adds weight and type properties to the entity file.
 * Executed after rendering each type entity.
 */
const hugoAfterRenderTypeEntitiesHook = async (event) => {
  const { filePath, name } = event.data;
  const dirPath = dirname(filePath);
  const indexFilePath = resolve(dirPath, "_index.md");
  const pageFileName = basename(filePath);
  
  // Append link to index file if it exists
  if (await fileExists(indexFilePath)) {
    try {
      const { url: linkPath } = hugoFormatFunctions.formatMDXLink({ text: name, url: pageFileName });
      const cardLine = `{{< card href="./${linkPath}" >}} ${name} {{< /card >}}`;

      await queueIndexUpdate(indexFilePath, async () => {
        const indexContent = await readFile(indexFilePath, "utf-8");
        const indexLines = indexContent.split(MARKDOWN_EOL);

        if (indexLines.includes(cardLine)) {
          return;
        }

        const openIndex = indexLines.indexOf(COLUMNS_OPEN);
        const closeIndex = indexLines.indexOf(COLUMNS_CLOSE);

        if (openIndex !== -1 && closeIndex !== -1 && closeIndex > openIndex) {
          indexLines.splice(closeIndex, 0, cardLine, "");
        } else {
          if (indexLines[indexLines.length - 1] !== "") {
            indexLines.push("");
          }
          indexLines.push(COLUMNS_OPEN, cardLine, "", COLUMNS_CLOSE, "");
        }

        await saveFile(indexFilePath, indexLines.join(MARKDOWN_EOL));
      });
    } catch (error) {
      console.error(`Failed to append to index file: ${indexFilePath}`, error);
    }
  }

  // Add weight and type: docs to the entity file
  try {
    const content = await readFile(filePath, "utf-8");
    const lines = content.split(MARKDOWN_EOL);

    // Find the end of front matter (closing ---)
    let frontMatterEnd = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === FRONT_MATTER_DELIMITER) {
        frontMatterEnd = i;
        break;
      }
    }

    // Check if type already exists
    const hasType = lines.slice(0, frontMatterEnd).some((line) =>
      line.startsWith("type:")
    );

    const hasBookHiddenNav = lines.slice(0, frontMatterEnd).some((line) =>
      line.startsWith("bookHiddenNav:")
    );

    const toAdd = [];
    if (!hasType) {
      toAdd.push("type: docs");
    }
    if (!hasBookHiddenNav) {
      toAdd.push("bookHiddenNav: true");
    }

    if (toAdd.length > 0) {
      // Add before the closing ---
      lines.splice(frontMatterEnd, 0, ...toAdd);
      await saveFile(filePath, lines.join(MARKDOWN_EOL));
    }
  } catch (error) {
    console.error(`Failed to add weight/type to ${filePath}`, error);
  }
};

/**
 * Appends a "View as Markdown" link to each page, pointing to its copy.
 */
const pageLinkHook = async (event) => {
  const { filePath, outputDir, outputAdapter } = event.data;
  const path = relative(outputDir, filePath)
    .split(sep)
    .join("/")
    .replace(/\.mdx?$/, "");
  const link = `\n\n[View as Markdown](${COPIES_URL}/${path}.md)\n`;

  // Use the output adapter when one is configured, the file system otherwise
  const page = outputAdapter?.readFile
    ? await outputAdapter.readFile(filePath)
    : await readFile(filePath, "utf-8");
  const content = `${page.trimEnd()}${link}`;
  await (outputAdapter?.writeFile
    ? outputAdapter.writeFile(filePath, content)
    : saveFile(filePath, content));
};

const afterRenderTypeEntitiesHook = async (event) => {
  // Keep the Hugo front matter edits, then link the copy
  await hugoAfterRenderTypeEntitiesHook(event);
  await pageLinkHook(event);
};

export default {
  ...hugoFormatFunctions,
  beforePrintTypeHook,
  formatMDXAdmonition,
  beforeGenerateIndexMetafileHook: HugoFormatter.beforeGenerateIndexMetafileHook,
  afterRenderTypeEntitiesHook,
};

// Also export mdxExtension if Hugo formatter has it
export const mdxExtension = HugoFormatter.mdxExtension;


