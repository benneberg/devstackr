export type DataType = typeof DataType[keyof typeof DataType];

export const DataType = {
  ANY: "any",
  JSON: "json",
  TEXT: "text",
  URL: "url",
  YAML: "yaml",
  CSV: "csv",
  XML: "xml",
  TS_INTERFACE: "typescript",
  JWT: "jwt",
  COLOR: "color",
  UUID: "uuid",
  TIMESTAMP: "timestamp",
  BINARY: "binary"
} as const;

export type Capability =
  | "jwt.sign"
  | "jwt.decode"
  | "json.parse"
  | "json.format"
  | "json.validate"
  | "typescript.ast.parse"
  | "typescript.type.infer"
  | "http.load-test"
  | "regex.extract"
  | "csv.parse"
  | "data.transform"
  | "pwa.generate"
  | "storage.manage"
  | "file.metadata"
  | "css.generate"
  | "glassmorphism.generate"
  | "neobrutalism.generate"
  | "python.execute"
  | "image.analyze"
  | "video.metadata"
  | "github.template"
  | "web.scrape"
  | "api.request"
  | "text.diff"
  | "cron.generate"
  | "json.to.ts"
  | "text.transform"
  | "timestamp.convert"
  | "base64.convert"
  | "log.analyze"
  | "svg.optimize"
  | "api.mock"
  | "url.parse"
  | "error.parse"
  | "html.to.jsx"
  | "zod.generate"
  | "layout.design"
  | "openapi.generate"
  | "ts.profile"
  | "graphql.visualize"
  | "db.design"
  | "webhook.debug"
  | "api.doc"
  | "playlist.manage"
  | "device.monitor"
  | "signage.preview"
  | "pipeline.visualize"
  | "data.map"
  | "schema.transform"
  | "stream.process"
  | "uuid.generate"
  | "color.pick";

export type CertificationStatus =
  | "draft"
  | "candidate"
  | "certified"
  | "stable";

export interface Certification {
  status: CertificationStatus;
  score: number; // 0–1
  lastVerified: string;
  autoCertified: boolean;
}

export interface ToolParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: { label: string; value: any }[];
  default?: any;
  description?: string;
}

export interface ToolInput {
  name: string;
  type: DataType;
  description: string;
  required: boolean;
}

export interface ToolOutput {
  type: DataType;
  description: string;
}

export interface ToolExample {
  input: any;
  output: any;
  description?: string;
}

export interface ToolPipeline {
  isPipelineCompatible: boolean;
  recommendedNextTools: string[];
  accepts: DataType[];
  produces: DataType[];
  stateless: boolean;
}

export interface OpenSpecs {
  stability: 'alpha' | 'beta' | 'stable';
  completeness: number;
  testCoverage: number;
  knownIssues: number;
  content?: string;
}

export interface ToolMetadata {
  author: string;
  license: string;
  version: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  features: string[];
  tags: string[];
  url: string;
  embedUrl?: string | null;
  previewImageUrl?: string | null;
  rating: number;
  userCount: number;
  isLocalModule: boolean;
  isWidget: boolean;
  widgetComponent?: string | null; // Identifier for the component map
  supportsContext: string[];
  icon?: string;
  nextTools?: string[]; // IDs of tools that are often used after this one
  inputTypes: DataType[];
  outputTypes: DataType[];
  parameters?: ToolParameter[];
  run?: (input: any, config?: any) => Promise<any>;
  detect?: (input: any) => number; // confidence score (0–1) for smart suggestions

  // Capability System
  capabilities: Capability[]; // Unique non-overlapping capabilities (e.g. "jwt.decode")

  // Certification System
  certification?: Certification;

  // New fields for the refined model
  inputs?: ToolInput[];
  outputs?: ToolOutput;
  example?: ToolExample;
  pipeline?: ToolPipeline;
  openSpecs?: OpenSpecs;
  metadata?: ToolMetadata;
}

export interface PipelineStep {
  id: string;
  toolId: string; // tool ID (e.g. "api-request", "json-format")
  config?: Record<string, any>;
  title?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  steps: PipelineStep[];
  category?: string;
  icon?: string;
}

export interface PipelineContext {
  stepOutputs: Record<string, any>;
  stepMetrics: Record<string, {
    duration: number; // ms
    startTime: number;
    endTime: number;
  }>;
  initialInput?: any;
  errors: Record<string, string>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: {
    toolId: string;
    instruction: string;
  }[];
  category: string;
  icon?: string;
}

export interface WidgetLayout {
  i: string;
  toolId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  state: Record<string, any>;
}

export interface SuggestedWorkset {
  id: string;
  title: string;
  trigger: string;
  tools: string[];
  expiresAt: number; // Timestamp
  dismissedAt?: number; // Timestamp
}

export interface UserState {
  userId: string;
  favorites: string[];
  recentlyUsed: string[];
  
  suggestedWorksets: SuggestedWorkset[];
  
  devToolbox: {
    isEnabled: boolean;
    layout: WidgetLayout[];
  };
  
  worksets: {
    id: string;
    name: string;
    tools: string[];
  }[];
  
  customization: {
    theme: 'light' | 'dark' | 'system';
    layout: 'grid' | 'list';
    clipboardMonitoring: boolean;
  };
  
  createdAt: number;
  updatedAt: number;
}

export interface WidgetProps {
  toolId: string;
  state: Record<string, any>;
  onStateChange: (newState: Record<string, any>) => void;
}

/**
 * Derived metrics for tool readiness
 */
export function getToolReadiness(tool: Tool) {
  const stability = tool.openSpecs?.stability || 'alpha';
  const completeness = tool.openSpecs?.completeness || 0;
  const testCoverage = tool.openSpecs?.testCoverage || 0;

  const reliability = 0.5 * (completeness / 100) + 0.5 * (testCoverage / 100);
  
  const pipelineConfidence = 
    stability === 'stable' ? 1 :
    stability === 'beta' ? 0.7 :
    0.4;

  return {
    reliability,
    pipelineConfidence,
    stability,
    completeness,
    testCoverage
  };
}
