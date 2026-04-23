import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";

const customMDX = pathToFileURL(
  resolve("./scripts/custom-hugo-mdx.mjs"),
).href;

await runGraphQLMarkdown(
  {
    schema: "https://countries.trevorblades.com/graphql",
    rootPath: "./content",
    baseURL: "graphql",
    linkRoot: "/",
    homepage: "./_index.md",
    mdxParser: customMDX,
    loaders: {
      UrlLoader: "@graphql-tools/url-loader",
    },
    pretty: true,
    force: true,
    docOptions: {
      "sectionHeaderId": false,
    },
  },
  {},
);

console.log("GraphQL docs generated in content/graphql");



