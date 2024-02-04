import { GatsbyNode, Node } from "gatsby";

// Helper function to process and transform content with Unified
async function transformContentWithUnified(content: string): Promise<string> {
  const { unified } = await import("unified");
  const { default: parse } = await import("remark-parse");
  const { default: remark2rehype } = await import("remark-rehype");
  const { default: stringify } = await import("rehype-stringify");

  const result = await unified()
    .use(parse)
    .use(remark2rehype)
    .use(stringify)
    .process(content);

  return result.toString();
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;
    createTypes(`
    interface UnifiedTransformable @nodeInterface {
      unified: String
    }
    type MarkdownRemark implements Node & UnifiedTransformable
    type File implements Node & UnifiedTransformable @dontInfer {
      unified: String
    }
  `);
    // Additional types for Contentful or other sources can be declared here
  };

export const createResolvers: GatsbyNode["createResolvers"] = async ({
  createResolvers,
  nodeModel,
}) => {
  createResolvers({
    MarkdownRemark: {
      unified: {
        type: "String",
        resolve: async (source: Node, args: any, context: any) => {
          const fileNode = context.nodeModel.getNodeById({ id: source.id });
          const content = fileNode?.internal.content || "";
          return transformContentWithUnified(content);
        },
      },
    },
    File: {
      unified: {
        type: "String",
        resolve: async (source: Node, args: any, context: any) => {
          if (source.internal.mediaType === "text/markdown") {
            const fileNode = context.nodeModel.getNodeById({ id: source.id });
            const content = fileNode?.internal.content || "";
            return transformContentWithUnified(content);
          }
          return null;
        },
      },
    },
  });
};
