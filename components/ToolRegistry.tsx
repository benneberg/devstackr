
import React from 'react';
import { JsonFormatterWidget } from './toolbox/widgets/JsonFormatterWidget';
import { UuidGeneratorWidget } from './toolbox/widgets/UuidGeneratorWidget';
import { ColorPickerWidget } from './toolbox/widgets/ColorPickerWidget';
import { GlassmorphismGenerator } from './tools/GlassmorphismGenerator';
import { AdvancedStorageManager } from './tools/AdvancedStorageManager';
import { PwaManifestGenerator } from './tools/PwaManifestGenerator';
import { FileMetadataViewer } from './tools/FileMetadataViewer';
import { NeobrutalismGenerator } from './tools/NeobrutalismGenerator';
import { PythonPlayground } from './tools/PythonPlayground';
import { ColorThief } from './tools/ColorThief';
import { VideoMetadataTool } from './tools/VideoMetadataTool';
import { GithubTemplateLibrary } from './tools/GithubTemplateLibrary';
import { ScraperExpert } from './tools/ScraperExpert';
import { JwtDecoder } from './tools/JwtDecoder';
import { ApiRequestBuilder } from './tools/ApiRequestBuilder';
import { DiffChecker } from './tools/DiffChecker';
import { CronGenerator } from './tools/CronGenerator';
import { JsonToTs } from './tools/JsonToTs';
import { UniversalDataTransformer } from './tools/UniversalDataTransformer';
import { TextTransformer } from './tools/TextTransformer';
import { TimestampConverter } from './tools/TimestampConverter';
import { Base64Tool } from './tools/Base64Tool';
import { LogAnalyzer } from './tools/LogAnalyzer';
import { SvgOptimizer } from './tools/SvgOptimizer';
import { MockApiGenerator } from './tools/MockApiGenerator';
import { QueryStringParser } from './tools/QueryStringParser';
import { ErrorStackParser } from './tools/ErrorStackParser';
import { HtmlToJsx } from './tools/HtmlToJsx';
import { JwtBuilder } from './tools/JwtBuilder';
import { ZodSchemaGenerator } from './tools/ZodSchemaGenerator';
import { ScreenLayoutDesigner } from './tools/ScreenLayoutDesigner';
import TsAstExplorer from './tools/TsAstExplorer';
import TypeInferenceVisualizer from './tools/TypeInferenceVisualizer';
import OpenApiTsGenerator from './tools/OpenApiTsGenerator';
import TsPerfProfiler from './tools/TsPerfProfiler';
import ApiLoadTester from './tools/ApiLoadTester';
import GraphqlVisualizer from './tools/GraphqlVisualizer';
import DbSchemaDesigner from './tools/DbSchemaDesigner';
import WebhookDebugger from './tools/WebhookDebugger';
import ApiDocGenerator from './tools/ApiDocGenerator';
import PlaylistManager from './tools/PlaylistManager';
import DeviceMonitor from './tools/DeviceMonitor';
import SignagePreviewer from './tools/SignagePreviewer';
import PipelineVisualizer from './tools/PipelineVisualizer';
import DataMapper from './tools/DataMapper';
import SchemaTransformer from './tools/SchemaTransformer';
import StreamProcessorSim from './tools/StreamProcessorSim';

// Placeholder for tools not yet implemented
const PlaceholderTool = ({ name }: { name: string }) => (
  <div className="p-12 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl">
    <h3 className="text-lg font-bold text-gray-900">{name}</h3>
    <p className="text-gray-500">This tool component is under construction.</p>
  </div>
);

export const TOOL_REGISTRY: Record<string, React.ComponentType<any>> = {
  'json-formatter': (props) => <div className="h-[500px] bg-white border border-gray-200 rounded-xl p-4"><JsonFormatterWidget {...props} state={props.state || {}} /></div>,
  'glassmorphism-generator': GlassmorphismGenerator,
  'advanced-storage-manager': AdvancedStorageManager,
  'pwa-manifest-generator': PwaManifestGenerator,
  'file-metadata-viewer': FileMetadataViewer,
  'neobrutalism-generator': NeobrutalismGenerator,
  'python-playground': PythonPlayground,
  'color-thief': ColorThief,
  'video-metadata-tool': VideoMetadataTool,
  'github-template-library': GithubTemplateLibrary,
  'scraper-expert': ScraperExpert,
  'uuid-generator': UuidGeneratorWidget,
  'color-picker': ColorPickerWidget,
  'jwt-decoder': JwtDecoder,
  'api-request-builder': ApiRequestBuilder,
  'diff-checker': DiffChecker,
  'cron-generator': CronGenerator,
  'json-to-ts': JsonToTs,
  'universal-data-transformer': UniversalDataTransformer,
  'text-transformer': TextTransformer,
  'timestamp-converter': TimestampConverter,
  'base64-tool': Base64Tool,
  'log-analyzer': LogAnalyzer,
  'svg-optimizer': SvgOptimizer,
  'mock-api-generator': MockApiGenerator,
  'query-string-parser': QueryStringParser,
  'error-stack-parser': ErrorStackParser,
  'html-to-jsx': HtmlToJsx,
  'jwt-builder': JwtBuilder,
  'zod-schema-generator': ZodSchemaGenerator,
  'screen-layout-designer': ScreenLayoutDesigner,
  'ts-ast-explorer': TsAstExplorer,
  'type-inference-visualizer': TypeInferenceVisualizer,
  'openapi-ts-generator': OpenApiTsGenerator,
  'ts-perf-profiler': TsPerfProfiler,
  'api-load-tester': ApiLoadTester,
  'graphql-visualizer': GraphqlVisualizer,
  'db-schema-designer': DbSchemaDesigner,
  'webhook-debugger': WebhookDebugger,
  'api-doc-generator': ApiDocGenerator,
  'playlist-manager': PlaylistManager,
  'device-monitor': DeviceMonitor,
  'signage-previewer': SignagePreviewer,
  'pipeline-visualizer': PipelineVisualizer,
  'data-mapper': DataMapper,
  'schema-transformer': SchemaTransformer,
  'stream-processor-sim': StreamProcessorSim,
};

export const getToolComponent = (id: string) => {
  return TOOL_REGISTRY[id] || null;
};
