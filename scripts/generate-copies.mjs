import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";
import { decorators } from "../lib/decorators.mjs";

rmSync("./.markdown-copies", { force: true, recursive: true });

// Runs in its own process: the printer keeps the first run's formatter within
// a process, so a second run in generate-docs.mjs would reuse the Hugo preset.
// Plain Markdown copies, published next to each page by the build scripts.
await runGraphQLMarkdown(
  {
    // Shared schema documented by every GraphQL-Markdown demo.
    schema:
      "https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/tests/e2e/__data__/demo_schema.graphql",
    rootPath: "./.markdown-copies",
    baseURL: "graphql",
    homepage: false,
    formatter: pathToFileURL(resolve("./lib/markdown-copy.mjs")).href,
    loaders: {
      UrlLoader: "@graphql-tools/url-loader",
    },
    pretty: true,
    decorators,
    force: true,
    telemetry: false,
    docOptions: {
      sectionHeaderId: false,
    },
  },
  {},
);

console.log("Markdown copies generated in .markdown-copies");
