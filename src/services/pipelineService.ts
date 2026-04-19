import { GoogleGenAI } from "@google/genai";
import { Tool, getToolReadiness, Capability } from "../../types";
import { capabilityRegistry, capabilityMatcher } from "./capabilityService";
import { CertificationSystem } from "./certificationService";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are a pipeline planner.

Convert user requests into a list of atomic capabilities.

Rules:
- Use only known capability names
- Be minimal (no redundant steps)
- Output JSON only

Available capabilities:
{{CAPABILITIES}}

Example:
Input: "Extract emails from CSV and validate JSON"
Output:
["csv.parse", "regex.extract", "json.validate"]
`;

export interface PipelineStep {
  tool: Tool;
  capability: Capability;
  readiness: ReturnType<typeof getToolReadiness>;
}

export interface PipelinePlan {
  capabilities: string[];
  pipeline: Tool[];
  missing: any[];
  typeIssues: string[];
  readiness: any[];
}

export class PipelinePlanner {
  /**
   * Decomposes user intent into a sequence of capabilities using LLM.
   */
  public static async parseIntentToCapabilities(prompt: string): Promise<Capability[]> {
    const allCapabilities = capabilityRegistry.getAllCapabilities();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: SYSTEM_PROMPT.replace("{{CAPABILITIES}}", allCapabilities.join(", ")) + `\nUser: ${prompt}`,
      config: {
        temperature: 0,
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text) as Capability[];
    } catch {
      throw new Error("Invalid LLM response format");
    }
  }

  /**
   * Alias for parseIntentToCapabilities to match UI expectations.
   */
  public static async decomposeIntent(prompt: string): Promise<Capability[]> {
    return this.parseIntentToCapabilities(prompt);
  }

  /**
   * Builds a deterministic pipeline from matched capabilities.
   */
  public static buildPipeline(matches: any[]): Tool[] {
    return matches
      .filter(m => m.status === "matched")
      .map(m => m.tool);
  }

  /**
   * Creates a plan from capabilities.
   */
  public static createPlan(capabilities: Capability[]) {
    const matches = capabilityMatcher.matchCapabilities(capabilities);
    const tools = this.buildPipeline(matches);
    const typeIssues = this.validatePipeline(tools);
    
    return {
      steps: tools.map(tool => ({
        id: `step-${tool.id}-${Date.now()}`,
        toolId: tool.id,
        tool: tool
      })),
      warnings: typeIssues
    };
  }

  /**
   * Validates type compatibility between steps.
   */
  public static validatePipeline(tools: Tool[]): string[] {
    const issues: string[] = [];

    for (let i = 0; i < tools.length - 1; i++) {
      const current = tools[i];
      const next = tools[i + 1];

      const isCompatible = current.pipeline?.produces.some(type => 
        next.pipeline?.accepts.includes(type)
      );

      if (!isCompatible) {
        issues.push(
          `Type mismatch: ${current.id} → ${next.id}`
        );
      }
    }

    return issues;
  }

  /**
   * Checks tool readiness and certification safety.
   */
  public static checkReadiness(tools: Tool[]) {
    return tools.map(tool => {
      const readiness = getToolReadiness(tool);
      const isSafe = tool.certification ? CertificationSystem.isPipelineSafe(tool.certification) : false;

      return {
        tool: tool.id,
        confidence: readiness.pipelineConfidence,
        warning: readiness.pipelineConfidence < 0.7 || !isSafe,
        isSafe
      };
    });
  }

  /**
   * Orchestrates the full planning process.
   */
  public static async plan(prompt: string): Promise<PipelinePlan> {
    const capabilities = await this.parseIntentToCapabilities(prompt);
    const matches = capabilityMatcher.matchCapabilities(capabilities);
    const missing = matches.filter(m => m.status === "missing");
    const pipeline = this.buildPipeline(matches);
    const typeIssues = this.validatePipeline(pipeline);
    const readiness = this.checkReadiness(pipeline);

    return {
      capabilities,
      pipeline,
      missing,
      typeIssues,
      readiness
    };
  }

  /**
   * Executes the pipeline steps sequentially.
   */
  public static async executePipeline(tools: Tool[], input: any) {
    let data = input;

    for (const tool of tools) {
      if (!tool.run) {
        throw new Error(`Tool ${tool.id} is not executable (missing run function).`);
      }
      try {
        data = await tool.run(data);
      } catch (err) {
        throw new Error(`Execution failed at ${tool.id}: ${err}`);
      }
    }

    return data;
  }

  /**
   * LLM Feedback Loop for failures.
   */
  public static async feedbackLoop(error: any, context: any) {
    const prompt = `
Pipeline failed.

Error:
${error}

Context:
${JSON.stringify(context)}

Suggest:
1. Fix
2. Alternative pipeline
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.7 }
    });

    return response.text;
  }
}
