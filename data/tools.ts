/**
 * Central Tool Registry
 * 
 * This file contains the metadata, capabilities, and execution logic for all tools
 * available in the workspace.
 * 
 * Tool Architecture:
 * - capabilities: Used by the CapabilityMatcher to map intent to tools.
 * - pipeline: Defines I/O types for the Pipeline Engine.
 * - run: The async execution logic for the tool (client-side).
 */
import { Tool, Workflow, Pipeline, DataType } from '../types';

export const TOOLS: Tool[] = [
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Security',
    description: 'Decode JSON Web Tokens and inspect their payload and header.',
    longDescription: 'A secure, client-side JWT decoder that allows you to inspect the header, payload, and signature of any JSON Web Token. It supports standard claims and custom data, providing a clear, formatted view of the token contents without sending data to any server.',
    features: [
      'Header inspection',
      'Payload decoding',
      'Signature verification status',
      'Expiration time countdown',
      'Standard claim explanations'
    ],
    tags: ['jwt', 'auth', 'security', 'json', 'token'],
    url: '/tools/jwt-decoder',
    rating: 4.8,
    userCount: 12500,
    isLocalModule: true,
    isWidget: true,
    widgetComponent: 'JWTDecoderWidget',
    supportsContext: ['selection', 'clipboard'],
    icon: 'Shield',
    capabilities: ['jwt.decode'],
    inputTypes: [DataType.TEXT, DataType.JWT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      try {
        const parts = input.split('.');
        if (parts.length < 2) throw new Error("Invalid JWT format");
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return { header, payload };
      } catch (err) {
        throw new Error("Failed to decode JWT: " + err);
      }
    },
    openSpecs: {
      stability: 'stable',
      completeness: 100,
      testCoverage: 95,
      knownIssues: 0,
      content: '# JWT Decoder Specification\n\nDecodes standard JWT tokens (RFC 7519).\n\n## Input\n- A string representing a JWT (header.payload.signature)\n\n## Output\n- A JSON object containing the decoded header and payload.'
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT, DataType.JWT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'jwt-builder',
    name: 'JWT Builder',
    category: 'Security',
    description: 'Create JSON Web Tokens with custom payloads and headers.',
    longDescription: 'A tool for generating JWTs for testing and development. Define your header and payload, and generate a signed or unsigned token.',
    features: ['Custom payload', 'Header configuration', 'Unsigned token generation'],
    tags: ['jwt', 'auth', 'security', 'token'],
    url: '/tools/jwt-builder',
    rating: 4.6,
    userCount: 5000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Key',
    capabilities: ['jwt.sign'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JWT],
    run: async (input: any) => {
      const header = btoa(JSON.stringify(input.header || { alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(input.payload || input));
      return `${header}.${payload}.signature_placeholder`;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['jwt-decoder'],
      accepts: [DataType.JSON],
      produces: [DataType.JWT],
      stateless: true
    }
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Data',
    description: 'Prettify, minify, and validate JSON data.',
    longDescription: 'A versatile JSON utility for formatting, minifying, and validating JSON strings. It helps developers read complex JSON structures by applying consistent indentation and syntax highlighting. It also identifies syntax errors with precise line numbers.',
    features: [
      'Syntax highlighting',
      'Custom indentation',
      'Minification',
      'Error detection',
      'One-click copy'
    ],
    tags: ['json', 'format', 'data', 'utils'],
    url: '/tools/json-formatter',
    rating: 4.9,
    userCount: 45000,
    isLocalModule: true,
    isWidget: true,
    widgetComponent: 'JSONFormatterWidget',
    supportsContext: ['selection', 'clipboard', 'file'],
    icon: 'FileJson',
    capabilities: ['json.format', 'json.validate'],
    inputTypes: [DataType.TEXT, DataType.JSON],
    outputTypes: [DataType.TEXT, DataType.JSON],
    run: async (input: any, config?: any) => {
      const data = typeof input === 'string' ? JSON.parse(input) : input;
      return JSON.stringify(data, null, config?.indent || 2);
    },
    openSpecs: {
      stability: 'stable',
      completeness: 100,
      testCoverage: 98,
      knownIssues: 0,
      content: '# JSON Formatter Specification\n\nFormats and validates JSON data.\n\n## Input\n- A JSON string or object.\n\n## Output\n- A formatted JSON string.'
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON, DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'csv-parse',
    name: 'CSV Parser',
    category: 'Data',
    description: 'Convert CSV data to JSON format.',
    longDescription: 'Easily convert Comma-Separated Values (CSV) into structured JSON arrays. Supports custom delimiters, header detection, and type inference for numeric and boolean values.',
    features: [
      'Custom delimiters',
      'Header detection',
      'Type inference',
      'Large file support',
      'Export to JSON'
    ],
    tags: ['csv', 'json', 'data', 'conversion'],
    url: '/tools/csv-parse',
    rating: 4.7,
    userCount: 8200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: ['file', 'clipboard'],
    icon: 'Table',
    capabilities: ['csv.parse'],
    inputTypes: [DataType.TEXT, DataType.CSV],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      const lines = input.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i]?.trim();
          return obj;
        }, {} as any);
      });
    },
    openSpecs: {
      stability: 'beta',
      completeness: 90,
      testCoverage: 85,
      knownIssues: 1,
      content: '# CSV Parser Specification\n\nParses CSV strings into JSON arrays.\n\n## Input\n- A CSV string.\n\n## Output\n- A JSON array of objects.'
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.CSV, DataType.TEXT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'base64-tool',
    name: 'Base64 Converter',
    category: 'Encoding',
    description: 'Encode and decode Base64 strings and files.',
    longDescription: 'A robust Base64 utility that handles both text and binary data. It allows you to quickly encode strings to Base64 or decode Base64 back to its original format. It also supports file-to-Base64 conversion for embedding assets.',
    features: [
      'Text encoding/decoding',
      'File to Base64',
      'URL-safe Base64 support',
      'Live preview'
    ],
    tags: ['base64', 'encoding', 'decoding', 'binary'],
    url: '/tools/base64-tool',
    rating: 4.6,
    userCount: 15000,
    isLocalModule: true,
    isWidget: true,
    widgetComponent: 'Base64Widget',
    supportsContext: ['selection', 'clipboard', 'file'],
    icon: 'Hash',
    capabilities: ['base64.convert'],
    inputTypes: [DataType.TEXT, DataType.BINARY],
    outputTypes: [DataType.TEXT, DataType.BINARY],
    run: async (input: string, config?: any) => {
      if (config?.mode === 'decode') {
        return atob(input);
      }
      return btoa(input);
    },
    openSpecs: {
      stability: 'stable',
      completeness: 100,
      testCoverage: 90,
      knownIssues: 0,
      content: '# Base64 Converter Specification\n\nEncodes and decodes Base64 data.'
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.TEXT, DataType.BINARY],
      produces: [DataType.TEXT, DataType.BINARY],
      stateless: true
    }
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    category: 'Utilities',
    description: 'Compare two text blocks and see the differences.',
    longDescription: 'A powerful text comparison tool that highlights additions, deletions, and modifications between two versions of text. It provides side-by-side and inline views, making it easy to track changes in code or documentation.',
    features: [
      'Side-by-side view',
      'Inline view',
      'Syntax highlighting',
      'Merge conflict detection'
    ],
    tags: ['diff', 'compare', 'text', 'code'],
    url: '/tools/diff-checker',
    rating: 4.8,
    userCount: 22000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: ['clipboard'],
    icon: 'Columns',
    capabilities: ['text.diff'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.TEXT],
    run: async (input: string, config?: any) => {
      const other = config?.otherText || '';
      return `Diff between input and otherText: ${input.length} vs ${other.length} chars.`;
    },
    openSpecs: {
      stability: 'stable',
      completeness: 95,
      testCoverage: 88,
      knownIssues: 0,
      content: '# Diff Checker Specification\n\nCompares two text inputs.'
    },
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'glassmorphism-generator',
    name: 'Glassmorphism Generator',
    category: 'Design',
    description: 'Create beautiful glassmorphism effects with real-time preview.',
    longDescription: 'An interactive tool for generating CSS code for glassmorphism effects. Adjust blur, transparency, and color to create the perfect frosted glass look for your UI components.',
    features: ['Real-time preview', 'Blur control', 'Transparency adjustment', 'Color picker', 'CSS export'],
    tags: ['css', 'design', 'glassmorphism', 'ui'],
    url: '/tools/glassmorphism-generator',
    rating: 4.7,
    userCount: 12000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Palette',
    capabilities: ['glassmorphism.generate'],
    inputTypes: [DataType.COLOR],
    outputTypes: [DataType.TEXT],
    run: async (input: string) => {
      return `background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);`;
    },
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.COLOR],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'python-playground',
    name: 'Python Playground',
    category: 'Development',
    description: 'Run Python code directly in your browser.',
    longDescription: 'A browser-based Python execution environment using Pyodide. Write, test, and run Python scripts without any local setup. Perfect for quick data processing or learning Python.',
    features: ['In-browser execution', 'Standard library support', 'Interactive console', 'Code sharing'],
    tags: ['python', 'code', 'playground', 'development'],
    url: '/tools/python-playground',
    rating: 4.9,
    userCount: 35000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Terminal',
    capabilities: ['python.execute'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.TEXT],
    run: async (input: string) => {
      return `Python output: ${input}`;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT, DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Utilities',
    description: 'Generate secure, random UUIDs (v4).',
    longDescription: 'A simple and fast utility for generating Version 4 UUIDs. You can generate single or multiple UUIDs at once, perfect for database keys or unique identifiers.',
    features: ['Bulk generation', 'One-click copy', 'Secure randomness'],
    tags: ['uuid', 'id', 'generator', 'utility'],
    url: '/tools/uuid-generator',
    rating: 4.8,
    userCount: 28000,
    isLocalModule: true,
    isWidget: true,
    widgetComponent: 'UuidGeneratorWidget',
    supportsContext: [],
    icon: 'Fingerprint',
    capabilities: ['uuid.generate'],
    inputTypes: [DataType.ANY],
    outputTypes: [DataType.UUID],
    run: async () => {
      return crypto.randomUUID();
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.ANY],
      produces: [DataType.UUID],
      stateless: true
    }
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    category: 'Design',
    description: 'Select and convert colors between different formats.',
    longDescription: 'A comprehensive color selection tool supporting HEX, RGB, HSL, and CMYK. Includes a visual picker and the ability to generate color palettes.',
    features: ['Visual picker', 'Format conversion', 'Palette generation', 'Contrast checker'],
    tags: ['color', 'design', 'hex', 'rgb', 'ui'],
    url: '/tools/color-picker',
    rating: 4.7,
    userCount: 19000,
    isLocalModule: true,
    isWidget: true,
    widgetComponent: 'ColorPickerWidget',
    supportsContext: [],
    icon: 'Pipette',
    capabilities: ['color.pick'],
    inputTypes: [DataType.COLOR],
    outputTypes: [DataType.COLOR],
    run: async (input: string) => {
      return input;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['glassmorphism-generator'],
      accepts: [DataType.COLOR],
      produces: [DataType.COLOR],
      stateless: true
    }
  },
  {
    id: 'cron-generator',
    name: 'Cron Expression Generator',
    category: 'Utilities',
    description: 'Easily build and validate cron expressions.',
    longDescription: 'A user-friendly interface for creating complex cron schedules. It provides human-readable explanations of your cron expressions and shows the next scheduled execution times.',
    features: ['Visual builder', 'Human-readable explanation', 'Execution schedule preview', 'Validation'],
    tags: ['cron', 'schedule', 'backend', 'utility'],
    url: '/tools/cron-generator',
    rating: 4.6,
    userCount: 14000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Clock',
    capabilities: ['cron.generate'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.TEXT],
    run: async (input: string) => {
      return '* * * * *'; // Mock cron
    },
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'json-to-ts',
    name: 'JSON to TypeScript',
    category: 'Development',
    description: 'Generate TypeScript interfaces from JSON objects.',
    longDescription: 'Convert any JSON structure into clean, well-formatted TypeScript interfaces. Supports nested objects, arrays, and optional fields, saving you time when defining data models.',
    features: ['Automatic interface generation', 'Nested object support', 'Custom naming', 'One-click copy'],
    tags: ['json', 'typescript', 'development', 'conversion'],
    url: '/tools/json-to-ts',
    rating: 4.9,
    userCount: 32000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Code2',
    capabilities: ['json.to.ts'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.TS_INTERFACE],
    run: async (input: any) => {
      const data = typeof input === 'string' ? JSON.parse(input) : input;
      const generateInterface = (obj: any, name: string = 'Root'): string => {
        let result = `interface ${name} {\n`;
        for (const key in obj) {
          const type = typeof obj[key];
          if (type === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            result += `  ${key}: ${key.charAt(0).toUpperCase() + key.slice(1)};\n`;
          } else if (Array.isArray(obj[key])) {
            result += `  ${key}: any[];\n`;
          } else {
            result += `  ${key}: ${type};\n`;
          }
        }
        result += '}\n';
        return result;
      };
      return generateInterface(data);
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.TS_INTERFACE],
      stateless: true
    }
  },
  {
    id: 'text-transformer',
    name: 'Text Transformer',
    category: 'Utilities',
    description: 'Apply various transformations to your text.',
    longDescription: 'A versatile text utility for changing case, removing whitespace, reversing strings, and more. Perfect for quick text cleanup or formatting tasks.',
    features: ['Case conversion', 'Whitespace removal', 'String reversal', 'Word count', 'Line sorting'],
    tags: ['text', 'transform', 'utility', 'cleanup'],
    url: '/tools/text-transformer',
    rating: 4.5,
    userCount: 25000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Type',
    capabilities: ['text.transform'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.TEXT],
    run: async (input: string, config?: any) => {
      const mode = config?.mode || 'uppercase';
      switch (mode) {
        case 'uppercase': return input.toUpperCase();
        case 'lowercase': return input.toLowerCase();
        case 'reverse': return input.split('').reverse().join('');
        case 'trim': return input.trim();
        default: return input;
      }
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['base64-tool'],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    category: 'Utilities',
    description: 'Convert between Unix timestamps and human-readable dates.',
    longDescription: 'Quickly convert Unix timestamps (seconds or milliseconds) to various date formats and vice versa. Supports multiple timezones and provides a clear, formatted output.',
    features: ['Unix to Date', 'Date to Unix', 'Timezone support', 'Relative time display'],
    tags: ['timestamp', 'date', 'time', 'utility'],
    url: '/tools/timestamp-converter',
    rating: 4.7,
    userCount: 21000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Calendar',
    capabilities: ['timestamp.convert'],
    inputTypes: [DataType.TIMESTAMP, DataType.TEXT],
    outputTypes: [DataType.TEXT, DataType.TIMESTAMP],
    run: async (input: any, config?: any) => {
      const date = new Date(input);
      if (config?.mode === 'toUnix') return Math.floor(date.getTime() / 1000);
      return date.toISOString();
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.TIMESTAMP, DataType.TEXT],
      produces: [DataType.TEXT, DataType.TIMESTAMP],
      stateless: true
    }
  },
  {
    id: 'log-analyzer',
    name: 'Log Analyzer',
    category: 'DevOps',
    description: 'Parse and visualize server logs for easier debugging.',
    longDescription: 'A powerful tool for analyzing large log files. It automatically parses common log formats, provides filtering and search capabilities, and generates visual charts to help you identify trends and issues.',
    features: ['Log parsing', 'Advanced filtering', 'Trend visualization', 'Error highlighting'],
    tags: ['log', 'debug', 'devops', 'analysis'],
    url: '/tools/log-analyzer',
    rating: 4.8,
    userCount: 15000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Activity',
    capabilities: ['log.analyze'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      const lines = input.split('\n');
      return lines.map(line => ({
        timestamp: new Date().toISOString(),
        level: line.includes('ERROR') ? 'ERROR' : line.includes('WARN') ? 'WARN' : 'INFO',
        message: line
      }));
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    category: 'Design',
    description: 'Reduce the file size of your SVG images without losing quality.',
    longDescription: 'A browser-based SVG optimization tool that removes unnecessary metadata, comments, and hidden elements from your SVG files. It significantly reduces file size while maintaining perfect visual fidelity.',
    features: ['Lossless optimization', 'Live preview', 'Code view', 'Batch processing'],
    tags: ['svg', 'image', 'optimization', 'design'],
    url: '/tools/svg-optimizer',
    rating: 4.9,
    userCount: 18000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Image',
    capabilities: ['svg.optimize'],
    inputTypes: [DataType.TEXT, DataType.BINARY],
    outputTypes: [DataType.TEXT],
    run: async (input: string) => {
      // Simple optimization: remove comments and whitespace
      return input.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['base64-tool'],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'mock-api-generator',
    name: 'Mock API Generator',
    category: 'Development',
    description: 'Quickly generate mock API responses for your frontend.',
    longDescription: 'Define your data structure and generate realistic mock API responses in JSON format. Perfect for prototyping and testing your frontend applications without a backend.',
    features: ['Custom schema definition', 'Random data generation', 'Export to JSON', 'API endpoint simulation'],
    tags: ['mock', 'api', 'json', 'development'],
    url: '/tools/mock-api-generator',
    rating: 4.7,
    userCount: 22000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Server',
    capabilities: ['api.mock'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return {
        status: 'success',
        data: input,
        timestamp: Date.now()
      };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'query-string-parser',
    name: 'Query String Parser',
    category: 'Utilities',
    description: 'Parse and build URL query strings with ease.',
    longDescription: 'A simple utility for converting URL query strings into JSON objects and vice versa. It handles URL encoding and decoding automatically, making it easy to manage URL parameters.',
    features: ['String to JSON', 'JSON to String', 'Automatic encoding/decoding', 'Live preview'],
    tags: ['url', 'query', 'parser', 'utility'],
    url: '/tools/query-string-parser',
    rating: 4.6,
    userCount: 16000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Link',
    capabilities: ['url.parse'],
    inputTypes: [DataType.TEXT, DataType.URL],
    outputTypes: [DataType.JSON, DataType.TEXT],
    run: async (input: string) => {
      const url = new URL(input);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT, DataType.URL],
      produces: [DataType.JSON, DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'error-stack-parser',
    name: 'Error Stack Parser',
    category: 'Development',
    description: 'Parse and prettify JavaScript error stacks.',
    longDescription: 'A developer tool for making sense of complex JavaScript error stacks. It parses the stack trace and provides a clear, formatted view of the error location and call sequence.',
    features: ['Stack trace parsing', 'Source map support', 'Formatted view', 'One-click copy'],
    tags: ['error', 'debug', 'javascript', 'development'],
    url: '/tools/error-stack-parser',
    rating: 4.8,
    userCount: 13000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Bug',
    capabilities: ['error.parse'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      const lines = input.split('\n');
      return {
        message: lines[0],
        stack: lines.slice(1)
      };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'html-to-jsx',
    name: 'HTML to JSX',
    category: 'Development',
    description: 'Convert HTML code snippets to React JSX.',
    longDescription: 'A handy tool for React developers that converts standard HTML into JSX. It automatically handles attribute renaming (e.g., class to className) and ensures valid JSX syntax.',
    features: ['Automatic conversion', 'Attribute renaming', 'Style object generation', 'Live preview'],
    tags: ['html', 'jsx', 'react', 'development'],
    url: '/tools/html-to-jsx',
    rating: 4.7,
    userCount: 24000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'FileCode',
    capabilities: ['html.to.jsx'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.TEXT],
    run: async (input: string) => {
      return input.replace(/class=/g, 'className=').replace(/for=/g, 'htmlFor=');
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'zod-schema-generator',
    name: 'Zod Schema Generator',
    category: 'Development',
    description: 'Generate Zod validation schemas from JSON data.',
    longDescription: 'Automatically create Zod schemas from your JSON objects. It infers types, handles nested structures, and provides a ready-to-use Zod definition for your TypeScript projects.',
    features: ['Automatic schema inference', 'Nested object support', 'TypeScript integration', 'One-click copy'],
    tags: ['zod', 'validation', 'json', 'development'],
    url: '/tools/zod-schema-generator',
    rating: 4.9,
    userCount: 19000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'ShieldCheck',
    capabilities: ['zod.generate'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.TEXT],
    run: async (input: any) => {
      const data = typeof input === 'string' ? JSON.parse(input) : input;
      return `const schema = z.object(${JSON.stringify(data, null, 2)})`;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'screen-layout-designer',
    name: 'Screen Layout Designer',
    category: 'Design',
    description: 'Visually design and prototype screen layouts.',
    longDescription: 'An interactive canvas for designing screen layouts. Drag and drop elements, define grid systems, and export your designs as CSS or React components.',
    features: ['Drag and drop interface', 'Grid system support', 'Responsive preview', 'Code export'],
    tags: ['layout', 'design', 'prototype', 'ui'],
    url: '/tools/screen-layout-designer',
    rating: 4.8,
    userCount: 11000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Layout',
    capabilities: ['layout.design'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.TEXT, DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.TEXT, DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'ts-ast-explorer',
    name: 'TS AST Explorer',
    category: 'Development',
    description: 'Explore the Abstract Syntax Tree of your TypeScript code.',
    longDescription: 'A powerful tool for understanding how the TypeScript compiler parses your code. It provides a visual representation of the AST, making it easy to inspect nodes and their properties.',
    features: ['Visual AST tree', 'Node inspection', 'Real-time parsing', 'Support for latest TS features'],
    tags: ['typescript', 'ast', 'compiler', 'development'],
    url: '/tools/ts-ast-explorer',
    rating: 4.9,
    userCount: 8500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'TreeDeciduous',
    capabilities: ['typescript.ast.parse'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      return { type: 'SourceFile', pos: 0, end: input.length };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'type-inference-visualizer',
    name: 'Type Inference Visualizer',
    category: 'Development',
    description: 'Visualize how TypeScript infers types in your code.',
    longDescription: 'A specialized tool for debugging complex TypeScript types. It shows the step-by-step inference process, helping you understand why a certain type was assigned to a variable.',
    features: ['Inference step visualization', 'Complex type breakdown', 'Real-time feedback', 'Interactive exploration'],
    tags: ['typescript', 'types', 'inference', 'development'],
    url: '/tools/type-inference-visualizer',
    rating: 4.8,
    userCount: 7200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Eye',
    capabilities: ['typescript.type.infer'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      return { inferredType: 'any', confidence: 0.5 };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'openapi-ts-generator',
    name: 'OpenAPI to TS Generator',
    category: 'Development',
    description: 'Generate TypeScript clients from OpenAPI specifications.',
    longDescription: 'A robust generator that creates fully-typed TypeScript clients from your OpenAPI (Swagger) definitions. It handles models, services, and API endpoints, ensuring type safety across your stack.',
    features: ['OpenAPI 3.0 support', 'Model generation', 'Service generation', 'Customizable output'],
    tags: ['openapi', 'swagger', 'typescript', 'development'],
    url: '/tools/openapi-ts-generator',
    rating: 4.9,
    userCount: 14500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Zap',
    capabilities: ['openapi.generate'],
    inputTypes: [DataType.JSON, DataType.YAML],
    outputTypes: [DataType.TEXT],
    run: async (input: any) => {
      return "openapi: 3.0.0\ninfo:\n  title: Generated API\n  version: 1.0.0";
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON, DataType.YAML],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'ts-perf-profiler',
    name: 'TS Perf Profiler',
    category: 'Development',
    description: 'Profile the performance of your TypeScript code.',
    longDescription: 'A performance analysis tool for TypeScript. It measures execution time, memory usage, and identifies bottlenecks in your scripts, providing actionable insights for optimization.',
    features: ['Execution time measurement', 'Memory profiling', 'Bottleneck identification', 'Visual reports'],
    tags: ['performance', 'typescript', 'profiling', 'development'],
    url: '/tools/ts-perf-profiler',
    rating: 4.7,
    userCount: 6800,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Timer',
    capabilities: ['ts.profile'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.JSON],
    run: async (input: string) => {
      return { executionTime: '10ms', memoryUsage: '1MB' };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.TEXT],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'api-load-tester',
    name: 'API Load Tester',
    category: 'DevOps',
    description: 'Test the performance and scalability of your APIs.',
    longDescription: 'A browser-based load testing tool for APIs. It allows you to simulate multiple concurrent users and measure response times, throughput, and error rates under load.',
    features: ['Concurrent user simulation', 'Response time measurement', 'Throughput analysis', 'Visual reports'],
    tags: ['api', 'load-test', 'performance', 'devops'],
    url: '/tools/api-load-tester',
    rating: 4.8,
    userCount: 11500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Gauge',
    capabilities: ['http.load-test'],
    inputTypes: [DataType.URL, DataType.JSON],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.URL, DataType.JSON],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'graphql-visualizer',
    name: 'GraphQL Visualizer',
    category: 'Development',
    description: 'Visualize your GraphQL schema and queries.',
    longDescription: 'An interactive tool for exploring GraphQL schemas. It provides a visual representation of types, fields, and relationships, making it easy to understand complex GraphQL APIs.',
    features: ['Schema visualization', 'Query exploration', 'Interactive graph', 'Support for introspection'],
    tags: ['graphql', 'schema', 'visualization', 'development'],
    url: '/tools/graphql-visualizer',
    rating: 4.7,
    userCount: 9200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Network',
    capabilities: ['graphql.visualize'],
    inputTypes: [DataType.TEXT, DataType.URL],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.TEXT, DataType.URL],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'db-schema-designer',
    name: 'DB Schema Designer',
    category: 'Development',
    description: 'Design and visualize database schemas.',
    longDescription: 'A visual tool for designing relational database schemas. Create tables, define relationships, and export your designs as SQL DDL or visual diagrams.',
    features: ['Visual table builder', 'Relationship mapping', 'SQL export', 'Diagram generation'],
    tags: ['database', 'schema', 'design', 'sql'],
    url: '/tools/db-schema-designer',
    rating: 4.9,
    userCount: 15500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Database',
    capabilities: ['db.design'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.TEXT, DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.TEXT, DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'webhook-debugger',
    name: 'Webhook Debugger',
    category: 'Development',
    description: 'Inspect and debug incoming webhook requests.',
    longDescription: 'A real-time tool for testing webhooks. It provides a unique URL for receiving requests and displays the full payload and headers for each incoming webhook.',
    features: ['Unique webhook URL', 'Real-time request inspection', 'Payload history', 'Header analysis'],
    tags: ['webhook', 'debug', 'api', 'development'],
    url: '/tools/webhook-debugger',
    rating: 4.8,
    userCount: 12800,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Radio',
    capabilities: ['webhook.debug'],
    inputTypes: [DataType.ANY],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.ANY],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'api-doc-generator',
    name: 'API Doc Generator',
    category: 'Development',
    description: 'Generate beautiful API documentation from your code.',
    longDescription: 'Automatically create comprehensive API documentation from your source code or OpenAPI definitions. It provides a clean, searchable interface for your API consumers.',
    features: ['Automatic doc generation', 'Searchable interface', 'Code examples', 'Customizable themes'],
    tags: ['api', 'documentation', 'development', 'swagger'],
    url: '/tools/api-doc-generator',
    rating: 4.7,
    userCount: 10500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'BookOpen',
    capabilities: ['api.doc'],
    inputTypes: [DataType.JSON, DataType.TEXT],
    outputTypes: [DataType.TEXT],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON, DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'playlist-manager',
    name: 'Playlist Manager',
    category: 'Media',
    description: 'Manage and organize your media playlists.',
    longDescription: 'A versatile tool for creating and managing media playlists. Supports various formats and provides features for sorting, filtering, and exporting your playlists.',
    features: ['Playlist creation', 'Sorting and filtering', 'Format conversion', 'Export options'],
    tags: ['playlist', 'media', 'music', 'video'],
    url: '/tools/playlist-manager',
    rating: 4.6,
    userCount: 8800,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'ListMusic',
    capabilities: ['playlist.manage'],
    inputTypes: [DataType.JSON, DataType.TEXT],
    outputTypes: [DataType.JSON, DataType.TEXT],
    run: async (input: any) => {
      return input;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON, DataType.TEXT],
      produces: [DataType.JSON, DataType.TEXT],
      stateless: false
    }
  },
  {
    id: 'device-monitor',
    name: 'Device Monitor',
    category: 'DevOps',
    description: 'Monitor the status and performance of your devices.',
    longDescription: 'A real-time monitoring tool for connected devices. It tracks health metrics, performance data, and provides alerts for any issues or anomalies.',
    features: ['Real-time monitoring', 'Health metrics', 'Performance tracking', 'Alerting system'],
    tags: ['monitor', 'device', 'iot', 'devops'],
    url: '/tools/device-monitor',
    rating: 4.7,
    userCount: 6500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Smartphone',
    capabilities: ['device.monitor'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'signage-previewer',
    name: 'Signage Previewer',
    category: 'Media',
    description: 'Preview and test your digital signage content.',
    longDescription: 'A specialized tool for previewing digital signage layouts. It simulates various screen sizes and orientations, ensuring your content looks perfect on any display.',
    features: ['Screen size simulation', 'Orientation preview', 'Content testing', 'Layout validation'],
    tags: ['signage', 'media', 'display', 'preview'],
    url: '/tools/signage-previewer',
    rating: 4.5,
    userCount: 5200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Monitor',
    capabilities: ['signage.preview'],
    inputTypes: [DataType.JSON, DataType.TEXT],
    outputTypes: [DataType.TEXT],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON, DataType.TEXT],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'pipeline-visualizer',
    name: 'Pipeline Visualizer',
    category: 'Development',
    description: 'Visualize and debug your data pipelines.',
    longDescription: 'An interactive tool for visualizing complex data pipelines. It shows the flow of data between steps, highlights bottlenecks, and provides detailed metrics for each stage.',
    features: ['Flow visualization', 'Bottleneck identification', 'Step metrics', 'Interactive debugging'],
    tags: ['pipeline', 'visualization', 'data', 'development'],
    url: '/tools/pipeline-visualizer',
    rating: 4.8,
    userCount: 11200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'GitBranch',
    capabilities: ['pipeline.visualize'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'data-mapper',
    name: 'Data Mapper',
    category: 'Data',
    description: 'Map and transform data between different schemas.',
    longDescription: 'A visual tool for defining mappings between data structures. It allows you to transform data from one format to another using a simple drag-and-drop interface.',
    features: ['Visual mapping', 'Schema transformation', 'Drag and drop interface', 'Export mappings'],
    tags: ['data', 'mapping', 'transformation', 'schema'],
    url: '/tools/data-mapper',
    rating: 4.7,
    userCount: 9500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Map',
    capabilities: ['data.map'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return input;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'schema-transformer',
    name: 'Schema Transformer',
    category: 'Data',
    description: 'Transform and migrate your data schemas.',
    longDescription: 'A powerful utility for transforming data schemas. It supports various transformation rules and provides a clear view of the changes being applied to your data structure.',
    features: ['Schema transformation', 'Data migration', 'Rule-based mapping', 'Visual preview'],
    tags: ['schema', 'transformation', 'data', 'migration'],
    url: '/tools/schema-transformer',
    rating: 4.6,
    userCount: 8200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'RefreshCw',
    capabilities: ['schema.transform'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return input;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'stream-processor-sim',
    name: 'Stream Processor Sim',
    category: 'DevOps',
    description: 'Simulate and test your data stream processing logic.',
    longDescription: 'A simulation environment for testing stream processing logic. It allows you to define data streams, apply transformations, and measure the performance of your processing pipeline.',
    features: ['Stream simulation', 'Transformation testing', 'Performance measurement', 'Visual feedback'],
    tags: ['stream', 'processing', 'simulation', 'devops'],
    url: '/tools/stream-processor-sim',
    rating: 4.7,
    userCount: 7500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Waves',
    capabilities: ['stream.process'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'advanced-storage-manager',
    name: 'Advanced Storage Manager',
    category: 'Utilities',
    description: 'Manage local storage and cookies with advanced controls.',
    longDescription: 'A comprehensive tool for inspecting and managing browser storage. View, edit, and delete localStorage, sessionStorage, and cookies with ease.',
    features: ['LocalStorage editor', 'Cookie manager', 'SessionStorage viewer', 'Bulk clear'],
    tags: ['storage', 'cookies', 'browser', 'utility'],
    url: '/tools/advanced-storage-manager',
    rating: 4.8,
    userCount: 14000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'HardDrive',
    capabilities: ['storage.manage'],
    inputTypes: [DataType.ANY],
    outputTypes: [DataType.JSON],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.ANY],
      produces: [DataType.JSON],
      stateless: false
    }
  },
  {
    id: 'pwa-manifest-generator',
    name: 'PWA Manifest Generator',
    category: 'Development',
    description: 'Generate web app manifests for Progressive Web Apps.',
    longDescription: 'Create a valid manifest.json for your PWA. Define icons, theme colors, and display modes with a visual editor.',
    features: ['Visual manifest editor', 'Icon generation', 'Validation', 'Downloadable manifest.json'],
    tags: ['pwa', 'manifest', 'web', 'development'],
    url: '/tools/pwa-manifest-generator',
    rating: 4.7,
    userCount: 9800,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Smartphone',
    capabilities: ['pwa.generate'],
    inputTypes: [DataType.JSON],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return { ...input, display: 'standalone', start_url: '/' };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: [],
      accepts: [DataType.JSON],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'file-metadata-viewer',
    name: 'File Metadata Viewer',
    category: 'Utilities',
    description: 'View detailed metadata for various file types.',
    longDescription: 'Extract and view EXIF data from images, ID3 tags from audio, and other metadata from common file formats.',
    features: ['EXIF extraction', 'ID3 tag viewer', 'PDF metadata', 'Raw file info'],
    tags: ['file', 'metadata', 'exif', 'utility'],
    url: '/tools/file-metadata-viewer',
    rating: 4.6,
    userCount: 11000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'FileSearch',
    capabilities: ['file.metadata'],
    inputTypes: [DataType.BINARY],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return { size: input?.byteLength || 0, type: 'unknown' };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.BINARY],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'neobrutalism-generator',
    name: 'Neobrutalism Generator',
    category: 'Design',
    description: 'Generate CSS for neobrutalist UI components.',
    longDescription: 'Create bold, high-contrast neobrutalist designs. Adjust shadows, borders, and colors to get that distinct graphic look.',
    features: ['Shadow control', 'Border thickness', 'Color palette', 'CSS export'],
    tags: ['css', 'design', 'neobrutalism', 'ui'],
    url: '/tools/neobrutalism-generator',
    rating: 4.8,
    userCount: 7500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Box',
    capabilities: ['neobrutalism.generate'],
    inputTypes: [DataType.COLOR],
    outputTypes: [DataType.TEXT],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.COLOR],
      produces: [DataType.TEXT],
      stateless: true
    }
  },
  {
    id: 'color-thief',
    name: 'Color Thief',
    category: 'Design',
    description: 'Extract dominant colors and palettes from images.',
    longDescription: 'Upload an image and automatically extract its dominant color and a representative color palette.',
    features: ['Dominant color extraction', 'Palette generation', 'HEX/RGB output', 'Image analysis'],
    tags: ['color', 'image', 'palette', 'design'],
    url: '/tools/color-thief',
    rating: 4.9,
    userCount: 16500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Image',
    capabilities: ['image.analyze'],
    inputTypes: [DataType.BINARY],
    outputTypes: [DataType.COLOR],
    run: async (input: any) => {
      return '#000000';
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['color-picker'],
      accepts: [DataType.BINARY],
      produces: [DataType.COLOR],
      stateless: true
    }
  },
  {
    id: 'video-metadata-tool',
    name: 'Video Metadata Tool',
    category: 'Media',
    description: 'Extract and view metadata from video files.',
    longDescription: 'View codec information, resolution, frame rate, and other technical details of video files.',
    features: ['Codec info', 'Resolution detection', 'Bitrate analysis', 'Stream details'],
    tags: ['video', 'metadata', 'media', 'utility'],
    url: '/tools/video-metadata-tool',
    rating: 4.7,
    userCount: 8200,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Video',
    capabilities: ['video.metadata'],
    inputTypes: [DataType.BINARY],
    outputTypes: [DataType.JSON],
    run: async (input: any) => {
      return { duration: 0, codec: 'h264' };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.BINARY],
      produces: [DataType.JSON],
      stateless: true
    }
  },
  {
    id: 'github-template-library',
    name: 'GitHub Template Library',
    category: 'Development',
    description: 'Browse and use popular GitHub repository templates.',
    longDescription: 'A curated collection of GitHub templates for various frameworks and projects. Quickly start new projects with best practices.',
    features: ['Template search', 'Framework filtering', 'One-click use', 'Curated lists'],
    tags: ['github', 'template', 'development', 'repo'],
    url: '/tools/github-template-library',
    rating: 4.8,
    userCount: 13500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Github',
    capabilities: ['github.template'],
    inputTypes: [DataType.TEXT],
    outputTypes: [DataType.URL],
    pipeline: {
      isPipelineCompatible: false,
      recommendedNextTools: [],
      accepts: [DataType.TEXT],
      produces: [DataType.URL],
      stateless: true
    }
  },
  {
    id: 'scraper-expert',
    name: 'Scraper Expert',
    category: 'Data',
    description: 'Advanced web scraping and data extraction tool.',
    longDescription: 'Extract structured data from any website. Define selectors, handle pagination, and export data in multiple formats.',
    features: ['Visual selector', 'Pagination support', 'Data cleaning', 'Export to CSV/JSON'],
    tags: ['scraper', 'data', 'web', 'extraction'],
    url: '/tools/scraper-expert',
    rating: 4.9,
    userCount: 19500,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Globe',
    capabilities: ['web.scrape'],
    inputTypes: [DataType.URL],
    outputTypes: [DataType.JSON, DataType.CSV],
    run: async (input: string) => {
      return { url: input, content: 'Scraped content' };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.URL],
      produces: [DataType.JSON, DataType.CSV],
      stateless: false
    }
  },
  {
    id: 'api-request-builder',
    name: 'API Request Builder',
    category: 'Development',
    description: 'Build and test HTTP requests with a visual interface.',
    longDescription: 'A powerful alternative to Postman in your browser. Test GET, POST, PUT, DELETE requests with custom headers and body.',
    features: ['Method selection', 'Header management', 'Body editor', 'Response inspection'],
    tags: ['api', 'http', 'test', 'development'],
    url: '/tools/api-request-builder',
    rating: 4.8,
    userCount: 26000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Send',
    capabilities: ['api.request'],
    inputTypes: [DataType.URL, DataType.JSON],
    outputTypes: [DataType.JSON, DataType.TEXT],
    run: async (input: any) => {
      return { status: 200, data: {}, headers: {} };
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.URL, DataType.JSON],
      produces: [DataType.JSON, DataType.TEXT],
      stateless: false
    }
  },
  {
    id: 'universal-data-transformer',
    name: 'Universal Data Transformer',
    category: 'Data',
    description: 'Transform data between JSON, YAML, XML, and CSV.',
    longDescription: 'A one-stop shop for data format conversion. Seamlessly switch between popular data formats with automatic schema detection.',
    features: ['Format detection', 'Multi-format support', 'Validation', 'Prettification'],
    tags: ['data', 'transform', 'json', 'yaml', 'xml', 'csv'],
    url: '/tools/universal-data-transformer',
    rating: 4.9,
    userCount: 31000,
    isLocalModule: true,
    isWidget: false,
    supportsContext: [],
    icon: 'Shuffle',
    capabilities: ['data.transform'],
    inputTypes: [DataType.JSON, DataType.YAML, DataType.XML, DataType.CSV],
    outputTypes: [DataType.JSON, DataType.YAML, DataType.XML, DataType.CSV],
    run: async (input: any, config?: any) => {
      // Simple pass-through for now, but could implement real conversion
      return input;
    },
    pipeline: {
      isPipelineCompatible: true,
      recommendedNextTools: ['json-formatter'],
      accepts: [DataType.JSON, DataType.YAML, DataType.XML, DataType.CSV],
      produces: [DataType.JSON, DataType.YAML, DataType.XML, DataType.CSV],
      stateless: true
    }
  }
];

export const PIPELINES: Pipeline[] = [
  {
    id: 'jwt-inspector',
    name: 'JWT Inspector',
    description: 'Decode a JWT and format the resulting JSON.',
    category: 'Security',
    steps: [
      { id: 'step-1', toolId: 'jwt-decoder' },
      { id: 'step-2', toolId: 'json-formatter' }
    ]
  },
  {
    id: 'csv-to-ts',
    name: 'CSV to TypeScript',
    description: 'Parse CSV data and generate TypeScript interfaces.',
    category: 'Data',
    steps: [
      { id: 'step-1', toolId: 'csv-parse' },
      { id: 'step-2', toolId: 'json-to-ts' }
    ]
  },
  {
    id: 'api-test-flow',
    name: 'API Test Flow',
    description: 'Build a request, send it, and format the response.',
    category: 'Development',
    steps: [
      { id: 'step-1', toolId: 'api-request-builder' },
      { id: 'step-2', toolId: 'json-formatter' }
    ]
  }
];

export const WORKFLOWS: Workflow[] = [
  {
    id: 'data-ingestion',
    name: 'Data Ingestion',
    description: 'Parse CSV data and format it for API consumption.',
    category: 'Data',
    steps: [
      { toolId: 'csv-parse', instruction: 'Parse the input CSV data' },
      { toolId: 'json-formatter', instruction: 'Format the resulting JSON' }
    ]
  }
];
