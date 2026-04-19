import { Tool, Capability } from '../../types';
import { TOOLS } from '../../data/tools';

/**
 * Capability Registry Service
 * Enforces no duplicate tools and maps capabilities to tools (1-to-1).
 */
export class CapabilityRegistry {
  private static instance: CapabilityRegistry;
  private capabilityMap: Map<Capability, Tool> = new Map();

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CapabilityRegistry {
    if (!CapabilityRegistry.instance) {
      CapabilityRegistry.instance = new CapabilityRegistry();
    }
    return CapabilityRegistry.instance;
  }

  private initialize() {
    TOOLS.forEach(tool => {
      try {
        this.registerTool(tool);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * Registers a tool and its capabilities.
   * Enforces the "One capability -> One canonical tool" philosophy.
   */
  public registerTool(tool: Tool) {
    for (const capability of tool.capabilities) {
      if (this.capabilityMap.has(capability)) {
        const existing = this.capabilityMap.get(capability);
        throw new Error(
          `❌ Capability conflict: "${capability}" already handled by "${existing?.id}".`
        );
      }
      this.capabilityMap.set(capability, tool);
    }
  }

  /**
   * Resolves a capability to its canonical tool.
   */
  public getToolByCapability(capability: Capability): Tool | undefined {
    return this.capabilityMap.get(capability);
  }

  /**
   * Returns all registered capabilities.
   */
  public getAllCapabilities(): Capability[] {
    return Array.from(this.capabilityMap.keys()) as Capability[];
  }
}

export const capabilityRegistry = CapabilityRegistry.getInstance();

/**
 * Matching Engine
 * Used by the system and LLM to resolve capabilities to tools.
 */
export class CapabilityMatcher {
  constructor(private registry: CapabilityRegistry = capabilityRegistry) {}

  public matchCapabilities(capabilities: Capability[]) {
    return capabilities.map(cap => {
      const tool = this.registry.getToolByCapability(cap);

      if (!tool) {
        return {
          capability: cap,
          status: "missing" as const,
          tool: null
        };
      }

      return {
        capability: cap,
        status: "matched" as const,
        tool
      };
    });
  }
}

export const capabilityMatcher = new CapabilityMatcher();
