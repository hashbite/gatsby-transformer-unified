import { UnifiedPluginOptions } from "./types";

export const defaultPluginOptions: Partial<UnifiedPluginOptions> = {
  concurrencyLimit: 100,
  retryLimit: 3,
  nodeTypes: [
    ["MarkdownRemark", (source) => source.internal.content || ""],
    ["ContentfulMarkdown", (source: any) => source.raw || ""],
    ["File", (source, loadNodeContent) => loadNodeContent(source)],
  ],
};
