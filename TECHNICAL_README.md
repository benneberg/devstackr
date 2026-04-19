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

The application features a centralized tool registry that allows for easy addition and management of developer utilities.

### Tool Definition (`/types.ts`)
Each tool must conform to the `Tool` interface:
- `id`: Unique identifier.
- `name`: Display name.
- `category`: Tool category (e.g., "Design", "Development").
- `description`: Short summary.
- `inputTypes`: Array of `DataType` supported as input.
- `outputTypes`: Array of `DataType` produced as output.
- `run`: (Optional) Async function that implements the tool's logic.
- `isWidget`: Boolean indicating if the tool has a dashboard widget.

### Adding a New Tool
1. **Create Component**: Add your tool UI/logic in `src/components/tools/`.
2. **Define Metadata**: Add the tool's metadata to `src/data/tools.ts`.
3. **Implement `run`**: If the tool is intended for use in pipelines, implement the `run` function in its metadata.
4. **Register Widget**: If `isWidget` is true, add the component to the `WIDGET_COMPONENTS` map in `src/components/toolbox/ToolboxPanel.tsx`.

---

## ⛓️ Pipeline Engine

The Pipeline Engine allows users to chain multiple tools together to create automated workflows.

### How it Works
1. **Context Management**: The `PipelineContext` tracks the output of each step and passes it as input to the next.
2. **Type Validation**: Before execution, the engine validates that the output type of step *N* is compatible with the input type of step *N+1*.
3. **Execution**: Steps are executed sequentially. If a step fails, the pipeline stops and reports the error.
4. **Metrics**: The engine tracks the execution time of each step for performance monitoring.

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
