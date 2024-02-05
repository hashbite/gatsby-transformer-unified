import type {
  GatsbyNode,
  Node,
  PluginOptions,
  CreateResolversArgs,
} from "gatsby";
import type { Processor } from "unified" with {
  "resolution-mode": "require"
}

export type UnifiedGetSource = (
  source: Node,
  loadNodeContent: CreateResolversArgs["loadNodeContent"]
) => Promise<string> | string;

export interface UnifiedPluginOptions extends PluginOptions {
  processors: {
    [key: string]: () => Promise<Processor>;
  };
  nodeTypes: [string, UnifiedGetSource][];
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

export const defaultPluginOptions: Partial<UnifiedPluginOptions> = {
  nodeTypes: [
    ["MarkdownRemark", (source) => source.internal.content || ""],
    ["ContentfulMarkdown", (source: any) => source.raw || ""],
    ["File", (source, loadNodeContent) => loadNodeContent(source)],
  ],
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }, userPluginOptions: UnifiedPluginOptions) => {
    const pluginOptions = {
      ...defaultPluginOptions,
      ...userPluginOptions,
    };
    const { createTypes } = actions;

    // Dynamically add fields for each processor
    const typeDefs = [`interface UnifiedTransformable @nodeInterface {`];
    for (const key of Object.keys(pluginOptions.processors)) {
      typeDefs.push(`  ${key}: String`);
    }
    typeDefs.push(`}`);

    pluginOptions.nodeTypes.forEach(([nodeType]) => {
      typeDefs.push(
        `type ${nodeType} implements Node & UnifiedTransformable @dontInfer`
      );
    });

    createTypes(typeDefs.join("\n"));
  };

export const createResolvers: GatsbyNode["createResolvers"] = async (
  { createResolvers, loadNodeContent },
  userPluginOptions: UnifiedPluginOptions
) => {
  const pluginOptions = {
    ...defaultPluginOptions,
    ...userPluginOptions,
  };
  const resolvers: { [key: string]: any } = {};
  const nodeTypeMap = new Map(pluginOptions.nodeTypes);

  for (const [key, processorFactory] of Object.entries(
    pluginOptions.processors
  )) {
    const processor = await processorFactory();

    if (!processor || typeof processor.process !== "function") {
      throw new Error(
        `Processor for ${key} is not correctly configured. Make sure to pass a unified chain that exposes a process function.`
      );
    }

    // Define resolvers for each processor
    const resolveContent = async (source: Node) => {
      let content: string = "";

      // Get content of node
      const getSource = nodeTypeMap.get(source.internal.type);

      if (!getSource) {
        throw new Error(
          `You need to provide a getSource function for nodes of type ${source.internal.type}`
        );
      }

      try {
        content = await getSource(source, loadNodeContent);
      } catch (error) {
        console.error(
          `Error processing content with Unified in ${key}:`,
          error
        );
        throw new Error(
          `Failed to load content in ${key} at ${source.internal.type}. See console for details.`
        );
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

    // Assign the resolver function to supported node types
    for (const nodeType of nodeTypeMap.keys()) {
      resolvers[nodeType] = {
        ...resolvers[nodeType],
        [key]: {
          type: "String",
          resolve: resolveContent,
        },
      };
    }
  }

  createResolvers(resolvers);
};
