import { Tool, Certification, CertificationStatus } from '../../types';

/**
 * Tool Certification System
 * Purpose: Ensure that every tool meets minimum quality standards and is safe for pipeline execution.
 */
export class CertificationSystem {
  /**
   * Evaluates a tool's quality based on its openSpecs.
   */
  public static evaluateTool(tool: Tool): Certification {
    const specs = tool.openSpecs;
    if (!specs) {
      return {
        status: "draft",
        score: 0,
        lastVerified: new Date().toISOString(),
        autoCertified: true
      };
    }

    const { completeness, testCoverage, stability, knownIssues } = specs;

    const completenessScore = completeness / 100;
    const coverageScore = testCoverage / 100;
    const issuePenalty = knownIssues > 0 ? 0.2 : 0;

    const baseScore =
      0.4 * completenessScore +
      0.4 * coverageScore +
      0.2 * (stability === "stable" ? 1 : stability === "beta" ? 0.7 : 0.4);

    const finalScore = Math.max(0, baseScore - issuePenalty);

    let status: CertificationStatus = "draft";

    if (finalScore >= 0.85) status = "stable";
    else if (finalScore >= 0.7) status = "certified";
    else if (finalScore >= 0.5) status = "candidate";

    return {
      status,
      score: finalScore,
      lastVerified: new Date().toISOString(),
      autoCertified: true
    };
  }

  /**
   * Hard Requirements for Pipeline Use.
   */
  public static isPipelineSafe(cert: Certification): boolean {
    return cert.status === "certified" || cert.status === "stable";
  }

  /**
   * Hard Requirements for Registry.
   */
  public static validateToolStructure(tool: Tool) {
    if (!tool.capabilities?.length) {
      throw new Error(`${tool.id} missing capabilities`);
    }

    if (!tool.pipeline?.accepts || !tool.pipeline?.produces) {
      throw new Error(`${tool.id} missing pipeline metadata`);
    }

    if (!tool.openSpecs?.content) {
      throw new Error(`${tool.id} missing open-specs`);
    }
  }

  /**
   * Certifies a list of tools.
   */
  public static certifyTools(tools: Tool[]): Tool[] {
    return tools.map(tool => {
      try {
        this.validateToolStructure(tool);
        const cert = this.evaluateTool(tool);
        return {
          ...tool,
          certification: cert
        };
      } catch (err) {
        console.warn(`Tool validation failed for ${tool.id}:`, err);
        return tool;
      }
    });
  }
}
