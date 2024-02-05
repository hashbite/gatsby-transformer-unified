import type {
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
