import type { GatsbyConfig } from "gatsby";
import { UnifiedPluginOptions } from "gatsby-transformer-unified";

import type Unified from "unified";
const {
  cachedImport,
  defaultPluginOptions,
} = require("gatsby-transformer-unified");

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Gatsby Transformer Unified Example`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`, // Adjust according to your content directory
      },
    },
    {
      resolve: "gatsby-plugin-image",
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `k8iqpp6u0ior`,
        accessToken: `hO_7N0bLaCJFbu5nL3QVekwNeB_TNtg6tOCB_9qzKUw`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
    },
    {
      resolve: "gatsby-transformer-unified",
      options: {
        processors: {
          markdownToHtml: async () => {
            const { unified }: { unified: Unified.Processor } =
              await cachedImport("unified");

            const parse = await cachedImport("remark-parse");
            const remark2rehype = await cachedImport("remark-rehype");
            const stringify = await cachedImport("rehype-stringify");

            return unified()
              .use(parse.default)
              .use(remark2rehype.default)
              .use(stringify.default);
          },
        },
        nodeTypes: [
          ...defaultPluginOptions.nodeTypes,
          [
            "contentfulTextLongMarkdownTextNode",
            (source) => source.internal.content,
          ],
        ],
      } as UnifiedPluginOptions,
    },
  ],
};

export default config;
