import { Pipeline, PipelineContext, Tool, PipelineStep, DataType } from '../types';
import { TOOLS } from '../data/tools';

/**
 * Pipeline Execution Engine
 */
export async function runPipeline(
  pipeline: Pipeline, 
  input: any, 
  onStepStart?: (stepId: string) => void,
  onStepComplete?: (stepId: string, output: any) => void
): Promise<PipelineContext> {
  const context: PipelineContext = {
    stepOutputs: {},
    stepMetrics: {},
    initialInput: input,
    errors: {}
  };

  let currentInput = input;

  for (const step of pipeline.steps) {
    const tool = TOOLS.find(t => t.id === step.toolId);

    if (!tool) {
      const errorMsg = `Tool not found: ${step.toolId}`;
      context.errors[step.id] = errorMsg;
      throw new Error(errorMsg);
    }

    if (!tool.run) {
      const errorMsg = `Tool ${tool.name} does not support direct execution in a pipeline.`;
      context.errors[step.id] = errorMsg;
      throw new Error(errorMsg);
    }

    if (onStepStart) onStepStart(step.id);

    const startTime = performance.now();
    const startTimestamp = Date.now();

    try {
      const output = await tool.run(currentInput, step.config);
      const endTime = performance.now();
      const endTimestamp = Date.now();
      
      context.stepOutputs[step.id] = output;
      context.stepMetrics[step.id] = {
        duration: Math.round(endTime - startTime),
        startTime: startTimestamp,
        endTime: endTimestamp
      };
      
      currentInput = output;
      if (onStepComplete) onStepComplete(step.id, output);
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      context.errors[step.id] = errorMsg;
      console.error(`Error in pipeline step ${step.id} (${tool.name}):`, error);
      throw error;
    }
  }

  return context;
}

/**
 * Pipeline Validation Engine
 */
export function validatePipeline(pipeline: Pipeline): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  let currentOutputTypes: DataType[] = [DataType.ANY];

  pipeline.steps.forEach((step, index) => {
    const tool = TOOLS.find(t => t.id === step.toolId);
    if (!tool) {
      errors.push(`Step ${index + 1}: Tool "${step.toolId}" not found.`);
      return;
    }

    const isCompatible = tool.inputTypes.some(it => 
      currentOutputTypes.includes(it) || it === DataType.ANY || currentOutputTypes.includes(DataType.ANY)
    );

    if (!isCompatible) {
      errors.push(`Step ${index + 1}: "${tool.name}" expects [${tool.inputTypes.join(', ')}], but received [${currentOutputTypes.join(', ')}].`);
    }

    currentOutputTypes = tool.outputTypes;
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Smart Suggestions Engine
 * Uses detect() and type compatibility across tools
 */
export function suggestTools(input: any, previousToolId?: string): { toolId: string; score: number }[] {
  if (!input && !previousToolId) return [];
  
  const previousTool = previousToolId ? TOOLS.find(t => t.id === previousToolId) : null;
  const previousOutputTypes = previousTool ? previousTool.outputTypes : [DataType.ANY];

  return TOOLS
    .map(tool => {
      let score = tool.detect?.(input) ?? 0;
      
      // Boost score if types are compatible
      const typeCompatible = tool.inputTypes.some(it => 
        previousOutputTypes.includes(it) || it === DataType.ANY || previousOutputTypes.includes(DataType.ANY)
      );
      
      if (typeCompatible) score += 0.2;
      
      // Boost if explicitly listed in nextTools
      if (previousTool?.nextTools?.includes(tool.id)) score += 0.5;

      return {
        toolId: tool.id,
        score: Math.min(score, 1)
      };
    })
    .filter(t => t.score > 0.4)
    .sort((a, b) => b.score - a.score);
}

/**
 * Next Step Engine
 * Suggests tools that are often used after a given tool
 */
export function getNextTools(toolId: string): string[] {
  const tool = TOOLS.find(t => t.id === toolId);
  return tool?.nextTools || [];
}

/**
 * Auto Pipeline Builder
 * Detects type and selects tools to build a pipeline automatically
 */
export function buildAutoPipeline(input: any): Pipeline | null {
  const steps: PipelineStep[] = [];
  let currentInput = input;
  let currentToolId: string | undefined;

  // Try to build a chain of up to 3 tools
  for (let i = 0; i < 3; i++) {
    const suggestions = suggestTools(currentInput, currentToolId);
    if (suggestions.length === 0) break;

    // Filter out tools we already added to avoid loops
    const nextSuggestion = suggestions.find(s => !steps.some(step => step.toolId === s.toolId));
    if (!nextSuggestion) break;

    const tool = TOOLS.find(t => t.id === nextSuggestion.toolId);
    if (!tool) break;

    steps.push({
      id: `step-${i + 1}-${Date.now()}`,
      toolId: tool.id,
      title: tool.name
    });

    currentToolId = tool.id;
    // Note: We don't have the actual output yet, so we use the input for detection
    // in subsequent iterations, which is a limitation but works for simple chains.
  }

  if (steps.length === 0) return null;

  const firstTool = TOOLS.find(t => t.id === steps[0].toolId);

  return {
    id: `auto-${Date.now()}`,
    name: `${firstTool?.name} Workflow`,
    description: `Smart workflow generated based on your input context.`,
    steps
  };
}
