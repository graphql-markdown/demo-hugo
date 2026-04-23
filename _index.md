---
title: GraphQL Documentation
type: docs
weight: 1
---

Browse the GraphQL schema documentation for this API.

## Configuration

This documentation is generated using **GraphQL-Markdown** with the Hugo formatter and custom lifecycle hooks for advanced customization.

### Generation Pipeline

The GraphQL-Markdown generation process uses three key components:

**1. Hugo Formatter Preset** - Provides base Markdown output optimized for Hugo:

- `.md` file extension (not `.mdx`)
- Plain Markdown compatible with Hugo's Goldmark processor
- Badge rendering with CSS classes

**2. Custom Lifecycle Hooks** - Process documentation during generation:

- `beforeGenerateIndexMetafileHook` - Creates section index files (`_index.md`)
- `afterRenderTypeEntitiesHook` - Adds navigation links and metadata
- `formatMDXFrontmatter` - Renders page titles as H1 headings
- `formatMDXBadge` - Colors badges by type

**3. Hugo Configuration** - Enables HTML rendering:

- `[markup.goldmark.renderer] unsafe = true` - Allows `<span>` tags for styled badges
- Book theme integration - Provides sidebar navigation with automatic weight-based ordering

### Key Files

- `.graphqlrc.yml` - GraphQL-Markdown configuration
- `scripts/custom-hugo-mdx.mjs` - Custom formatter with lifecycle hooks
- `schema.graphql` - Source GraphQL schema
- `hugo.toml` - Hugo configuration
- `static/css/gqlmd-badges.css` - Badge styling
- `layouts/_partials/docs/inject/head.html` - CSS injection
