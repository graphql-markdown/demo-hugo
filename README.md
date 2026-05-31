# GraphQL-Markdown + Hugo demo

This project demonstrates how to generate GraphQL documentation with GraphQL-Markdown for a [Hugo](https://gohugo.io/) site using the [Book theme](https://github.com/alex-shpak/hugo-book).

**Live demo:** [graphql-markdown.dev/demo-hugo](https://graphql-markdown.dev/demo-hugo/)

## 🚀 Project Structure

Inside your GraphQL-Markdown + [Hugo](https://gohugo.io/) project with the [Book theme](https://github.com/alex-shpak/hugo-book), you'll see:

```text
.
├── content/
│   └── graphql/                 # Generated GraphQL documentation
│       ├── _index.md            # Homepage for /graphql/ section
│       ├── operations/          # Queries, mutations, subscriptions
│       ├── types/               # Objects, interfaces, inputs, scalars, enums
│       └── directives/          # GraphQL directives
├── static/
│   ├── css/
│   │   └── gqlmd-badges.css     # Badge styling
│   └── logo.png                 # GraphQL-Markdown logo
├── layouts/
│   └── _partials/docs/inject/
│       └── head.html            # Inject CSS for badges
├── themes/
│   └── book/                    # Hugo Book theme (submodule)
├── schema.graphql               # Sample GraphQL schema
├── graphql.config.mjs           # GraphQL-Markdown configuration
├── scripts/
│   └── custom-hugo-mdx.mjs      # Custom MDX formatter with lifecycle hooks
├── hugo.toml                    # Hugo site configuration
└── package.json
```

## 🎨 Features

- ✨ Custom MDX formatter extending the Hugo preset with lifecycle hooks
- 🎨 Color-coded type badges (deprecated, required, mutation, subscription)
- 📄 Automatic page title rendering as H1 headings
- 🗂️ Section index generation with automatic navigation links
- ⚖️ Sequential weight assignment for proper sidebar ordering
- 🔗 Clean URL paths without .md extensions in links
- 📱 Responsive sidebar navigation via Hugo Book theme

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run generate` | Generate docs from the GraphQL schema |
| `npm run dev` | Generate docs + serve a local Hugo preview |
| `npm run build` | Generate docs + build a static site to `public/` |
| `npm run clean` | Remove generated files and build output |

## 🏎️ Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:1313/graphql/`.

> 🧑‍🚀 Edit `schema.graphql` to use your own GraphQL schema.

## 📋 How it Works

The generation pipeline uses lifecycle hooks for advanced customization:

1. **beforeGenerateIndexMetafileHook** - Creates `_index.md` files for each section with proper frontmatter
2. **afterRenderTypeEntitiesHook** - Adds:
   - Navigation links to the section index
   - Sequential `weight` values for sidebar ordering
   - `type: docs` frontmatter for Hugo
3. **formatMDXFrontmatter** - Renders page titles as H1 headings
4. **formatMDXBadge** - Colors badges based on type (deprecated=red, required=blue, etc.)

The resulting Markdown is fully compatible with Hugo's Markdown processor, and badges render with custom CSS when `unsafe = true` is set in `hugo.toml`.

## 👀 Want to learn more?

Check out [GraphQL-Markdown's docs](https://graphql-markdown.dev/).
