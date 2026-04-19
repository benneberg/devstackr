# DevTools Workspace Technical Documentation

## 🏗️ Architecture Overview

DevTools Workspace is a React-based Single Page Application (SPA) designed for high performance and extensibility. It uses a modular architecture where tools are registered in a central registry and can be composed into complex pipelines.

### Core Technologies
- **React 19**: UI framework.
- **Vite**: Build tool and dev server.
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Icon library.
- **Framer Motion**: Animation engine.
- **Google Generative AI SDK**: For AI-powered expert assistance.

---

## 🛠️ Tool System
Each tool is defined in `/data/tools.ts` and must satisfy the `Tool` interface.

### Capability System (`/src/services/capabilityService.ts`)
We use a **Capability-Centric Architecture**. Instead of matching tools by name, the system matches them by canonical capabilities (e.g., `jwt.decode`).
- **CapabilityRegistry**: Acts as the source of truth for all supported atomic actions.
- **CapabilityMatcher**: Resolves a list of required capabilities into a set of executable tools.

### Certification System (`/src/services/certificationService.ts`)
The `CertificationSystem` evaluates tool metadata (`openSpecs`) to generate a quality score:
- **Stability**: Alpha, Beta, or Stable.
- **Reliability**: A weighted average of documentation completeness and test coverage.
- **Pipeline Confidence**: Determines if a tool is safe to be suggested in an automated sequence.

---

## ⛓️ Pipeline Engine

### Intent Decomposition (AI Planner)
The `PipelinePlanner` (`/src/services/pipelineService.ts`) utilizes the **Gemini 2.0 Flash** model to parse natural language requests.
1. The planner maps the user's intent to a list of atomic **capabilities**.
2. The `CapabilityMatcher` finds the best tools that provide those capabilities.
3. The engine performs a **Type Validation** pass to ensure data flows correctly between steps.

### Execution Flow
1. **Context Initialization**: `PipelineContext` is created with the initial user input.
2. **Sequential Run**: Each tool's `run()` function is invoked with the output of the previous step.
3. **Error Recovery**: If a step fails, the planner can initiate a "Feedback Loop" to suggest fixes or alternative toolpaths.

### Key Files
- `src/lib/pipelineService.ts`: Contains the core logic for running, validating, and auto-building pipelines.
- `src/pages/PipelineBuilder.tsx`: The interactive UI for creating and managing pipelines.

---

## 🔐 Authentication & Data Persistence (Current Status)

**Note: The current implementation uses mock services for demonstration purposes.**

### Mock Services (`/lib/mockFirebase.ts`)
- **`mockAuth`**: Simulates user login/logout and session management.
- **`mockFirestore`**: Simulates a NoSQL database using `localStorage`. It persists user profiles, favorites, and recently used tools.

### Future Integration
To move to production, the mock services should be replaced with real Firebase Auth and Firestore. The `UserContext` is already structured to support this transition with minimal changes to the UI components.

---

## 🚀 Future Improvements
- **Real Firebase Integration**: Replace mock auth and storage with real Firebase services.
- **Cloud Pipeline Execution**: Allow pipelines to run on a server for long-running tasks.
- **Tool Marketplace**: A system for users to share and import custom tool definitions.
- **Advanced AI Integration**: Use Gemini to automatically suggest and build pipelines based on natural language descriptions.
