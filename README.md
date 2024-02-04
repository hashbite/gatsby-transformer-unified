# Gatsby Transformer Unified

`gatsby-transformer-unified` is a powerful Gatsby plugin that leverages Unified.js for transforming text-based content, tailored for Gatsby v5. It enables seamless text transformations across a diverse range of data sources by integrating with `gatsby-source-filesystem` and extending support to any plugin compatible with `gatsby-transformer-remark`, including `gatsby-source-contentful`.

**Current Stage:** Actively tested as a promising replacement for `gatsby-plugin-mdx` v2.

![npm version](https://badge.fury.io/js/gatsby-transformer-unified.svg)

## Key Features

- **Unified.js Integration:** Utilize Unified.js for comprehensive text content transformation within Gatsby.
- **Efficient Importing:** Features a `cachedImport` helper for optimal performance in importing Unified plugins.
- **Configurable Pipelines:** Tailor Unified pipelines for specific content types, ensuring flexible transformations.
- **Extensive Plugin Compatibility:** Seamlessly integrates with `gatsby-source-filesystem` and any plugin that supports `gatsby-transformer-remark`, such as `gatsby-source-contentful`, enhancing versatility across various data sources.

## Getting Started

### Installation

```bash
npm install gatsby-transformer-unified unified
```

### Configuration

Add `gatsby-transformer-unified` to your `gatsby-config.js`, configuring it as needed:

```js
const { cachedImport } = require("gatsby-transformer-unified");

module.exports = {
  plugins: [
    {
      resolve: "gatsby-transformer-unified",
      options: {
        processors: {
          markdownToHtml: async ({ cachedImport }) => {
            const unified = await cachedImport("unified");
            const parse = await cachedImport("remark-parse");
            const remark2rehype = await cachedImport("remark-rehype");
            const stringify = await cachedImport("rehype-stringify");

            return unified()
              .use(parse)
              .use(remark2rehype)
              .use(stringify);
          },
        },
      },
    },
    // Additional plugins here...
  ],
};
```

### Processor Configuration

Customize your Unified processors within the plugin's options for specific content transformation needs:

#### Options:

- `processors`: Defines transformation names and corresponding async functions that create Unified processors. This enables dynamic and efficient plugin imports with `cachedImport`.

## Broad Compatibility

Designed for Gatsby v5, `gatsby-transformer-unified` is engineered to support a wide array of text-based content transformations. It is compatible with `gatsby-source-filesystem` and extends support to all plugins compatible with `gatsby-transformer-remark`, such as `gatsby-source-contentful`. This ensures a versatile application across different data sources.

## Testing and Feedback

We are exploring `gatsby-transformer-unified` as a viable alternative to `gatsby-plugin-mdx` v2 and encourage community feedback and contributions to assess its capabilities and refine its performance.

## Contribution Guidelines

Contributions are welcome! Please review our [contribution guidelines](CONTRIBUTING.md) for details on how to help improve `gatsby-transformer-unified`.

## License

`gatsby-transformer-unified` is distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.