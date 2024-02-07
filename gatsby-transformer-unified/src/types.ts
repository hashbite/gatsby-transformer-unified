import type {
  Node,
  IPluginRefOptions,
  CreateResolversArgs,
  PluginOptions,
} from "gatsby";
import type { Processor } from "unified" with {
  "resolution-mode": "require"
}

export type UnifiedGetSource = (
  source: Node,
  loadNodeContent: CreateResolversArgs["loadNodeContent"]
) => Promise<string> | string;

interface SharedUnifiedOptions {
  processors: {
    [key: string]: () => Promise<Processor>;
  };
  nodeTypes: [string, UnifiedGetSource][];
}

export interface IUnifiedPluginOptions
  extends PluginOptions,
    SharedUnifiedOptions {}

export interface UnifiedPluginOptions
  extends IPluginRefOptions,
    SharedUnifiedOptions {}
