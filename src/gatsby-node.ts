import type { GatsbyNode, Node, PluginOptions } from "gatsby";
import type { Processor } from "unified" with {
  "resolution-mode": "require"
}

interface UnifiedPluginOptions extends PluginOptions {
  processors: {
    [key: string]: () => Promise<Processor>;
  };
}

export const onPreInit: GatsbyNode["onPreInit"] = async (
  { reporter },
  pluginOptions: UnifiedPluginOptions
) => {
  if (!pluginOptions.processors) {
    reporter.warn("No processors defined for gatsby-transformer-unified");
    return;
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }, pluginOptions: UnifiedPluginOptions) => {
    const { createTypes } = actions;
    const typeDefs = [`interface UnifiedTransformable @nodeInterface {`];

    // Dynamically add fields for each processor
    for (const key of Object.keys(pluginOptions.processors)) {
      typeDefs.push(`  ${key}: String`);
    }

    typeDefs.push(`}`);
    typeDefs.push(
      `type MarkdownRemark implements Node & UnifiedTransformable @dontInfer`
    );
    typeDefs.push(
      `type File implements Node & UnifiedTransformable @dontInfer`
    );

    createTypes(typeDefs.join("\n"));
  };

export const createResolvers: GatsbyNode["createResolvers"] = async (
  { createResolvers, actions, loadNodeContent },
  pluginOptions: UnifiedPluginOptions
) => {
  const resolvers: { [key: string]: any } = {};

  for (const [key, processorFactory] of Object.entries(
    pluginOptions.processors
  )) {
    const processor = await processorFactory();

    if (!processor || typeof processor.process !== 'function') {
      throw new Error(`Processor for ${key} is not correctly configured. Make sure to pass a unified chain that exposes a process function.`);
    }

    // Define resolvers for each processor
    const resolveContent = async (source: Node) => {
      let content: string = "";

      if (source.internal.type === "MarkdownRemark") {
        // For MarkdownRemark, the content is directly available
        content = source.internal.content || "";
      } else if (source.internal.type === "File") {
        // For File nodes, use loadNodeContent to get the content
        content = await loadNodeContent(source);
      }

      // Process content with Unified
      try {
        const result = await processor.process(content);
        return result.toString();
      } catch (error) {
        console.error(
          `Error processing content with Unified in ${key}:`,
          error
        );
        throw new Error(
          `Failed to process content in ${key}. See console for details.`
        );
      }
    };

    // Assign the resolver function to MarkdownRemark and File types
    resolvers["MarkdownRemark"] = {
      ...resolvers["MarkdownRemark"],
      [key]: {
        type: "String",
        resolve: resolveContent,
      },
    };

    resolvers["File"] = {
      ...resolvers["File"],
      [key]: {
        type: "String",
        resolve: resolveContent,
      },
    };
  }

  createResolvers(resolvers);
};
