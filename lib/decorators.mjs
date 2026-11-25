// lib/decorators.mjs
// Decorators shared by the two outputs of this demo: the Zola pages
// (generate-docs.mjs) and the plain Markdown copies (generate-copies.mjs).
import {
  directiveOccurrence,
  hasDirectiveNamed,
} from "@graphql-markdown/graphql";

export const decorators = {
  // Mirrors the built-in `@deprecated` treatment (badge + callout) for the
  // type-level `@deprecatedType` directive, which the spec doesn't allow
  // `@deprecated` to target.
  deprecatedTypeTag: {
    predicate: hasDirectiveNamed("deprecatedType"),
    position: { into: "tags" },
    render: (_values, options) =>
      options.formatMDXBadge({ text: "deprecated" }),
  },
  deprecatedTypeNotice: {
    predicate: hasDirectiveNamed("deprecatedType"),
    position: { into: "description" },
    resolve: directiveOccurrence("deprecatedType"),
    render: ([value], options) =>
      options.formatMDXAdmonition(
        { text: String(value.reason), title: "Deprecated", type: "warning" },
        options.meta,
      ),
  },
};

export default decorators;
