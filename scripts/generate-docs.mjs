import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";
import { decorators } from "../lib/decorators.mjs";

const customMDX = pathToFileURL(
  resolve("./scripts/custom-hugo-mdx.mjs"),
).href;

await runGraphQLMarkdown(
  {
    // Shared schema documented by every GraphQL-Markdown demo.
    schema:
      "https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/tests/e2e/__data__/demo_schema.graphql",
    rootPath: "./content",
    baseURL: "graphql",
    linkRoot: "/demo-hugo",
    homepage: "./_index.md",
    formatter: customMDX,
    loaders: {
      UrlLoader: "@graphql-tools/url-loader",
    },
    pretty: true,
    decorators,
    force: true,
    telemetry: false,
    docOptions: {
      "sectionHeaderId": false,
    },
  },
  {},
);

console.log("GraphQL docs generated in content/graphql");



