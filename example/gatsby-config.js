/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */
const { cachedImport, defaultPluginOptions } = require("gatsby-transformer-unified")

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
    siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content/`, // Adjust according to your content directory
      },
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
      /**
       * @type {import('gatsby-transformer-unified').UnifiedPluginOptions}
       */
      options: {
        processors: {
          markdownToHtml: async () => {
            const { unified } = await cachedImport("unified")
            const parse = await cachedImport("remark-parse")
            const remark2rehype = await cachedImport("remark-rehype")
            const stringify = await cachedImport("rehype-stringify")

            return unified()
              .use(parse.default)
              .use(remark2rehype.default)
              .use(stringify.default)
          },
        },
        nodeTypes: [
          ...defaultPluginOptions.nodeTypes,
          ["contentfulTextLongMarkdownTextNode", (source) => source.internal.content],
        ],
      },
    },
  ],
}
