# Devstackr

A capability-driven, type-safe developer automation runtime with AI-assisted workflow orchestration and composable execution pipelines.

Devstackr enables engineers to build, execute, and automate workflows by chaining modular tools through a deterministic capability system, enhanced by AI-driven intent decomposition.

⸻

Core Capabilities

* Capability-Centric Tooling System
    Tools are not matched by name, but by canonical atomic capabilities (e.g. jwt.decode, csv.parse), enabling deterministic orchestration.
* Type-Safe Pipeline Engine
    Execution flows are validated using strict input/output type constraints, forming a browser-native DAG execution model.
* AI Intent Compiler (Gemini-powered)
    Natural language requests are compiled into structured execution plans mapped to capabilities, not direct tool calls.
* Certification & Trust Layer
    Tools are analyzed for stability, completeness, and pipeline safety using a structured certification system.
* Client-Side Execution Runtime
    All transformations execute locally in the browser for speed, privacy, and portability.

⸻

System Architecture

Devstackr is composed of three core layers:

1. Tool Layer

A registry of modular tools defined by:

* input/output types
* capabilities
* execution logic

2. Capability Layer

A deterministic mapping system that resolves:

required capabilities → valid tool candidates

3. Execution Layer (Pipeline Engine)

A runtime that:

* validates type flow
* executes sequential transformations
* handles failure recovery and replanning

4. AI Planning Layer

Gemini-based planner that:

* converts natural language → capability graph
* delegates execution to deterministic engine

⸻

🛠️ Why this matters

Most automation systems rely on:

* fuzzy matching
* prompt chaining
* implicit tool selection

Devstackr instead enforces:

deterministic execution through typed capability resolution


## 🛠️ Project Structure

```text
/
├── components/         # UI Elements
│   ├── tools/          # Individual Tool implementations
│   ├── toolbox/        # Sidebar and Widget infrastructure
│   └── ui/             # Shadcn-inspired layout components
├── data/
│   └── tools.ts        # Central Registry: Metadata, Capabilities, and Run logic
├── pages/              # Application Views (Dashboard, Catalog, Builder)
├── src/
│   └── services/       # Core Logic (AI Planner, Capability Registry, Certification)
├── lib/                # Utility Services (Pipeline Runner, Mock Firebase)
├── types.ts            # Global Type Definitions (Capability Union, Tool Interface)
└── App.tsx             # Main entry and routing configuration
```

## 🛠️ Documentation

For detailed technical information on the architecture, tool system, and pipeline engine, please refer to the [TECHNICAL_README.md](./TECHNICAL_README.md).

## 🛠️ Adding a New Tool

1. **Create UI**: Implement the tool interface in `/components/tools/`.
2. **Define Capability**: If introducing a new atomic action, add it to the `Capability` union in `/types.ts`.
3. **Register Tool**: Add the metadata to `/data/tools.ts`. Ensure `inputTypes` and `outputTypes` are correct for pipeline compatibility.
4. **Implement `run`**: Add an async `run` function to enable usage in the Pipeline Engine.
5. **Certification**: Add `openSpecs` to the metadata to enable the automated certification score.

## 📦 Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS** for styling
- **Lucide React** for iconography
- **Framer Motion** for animations
- **Google Generative AI** for expert assistance

## 🔐 Security & Privacy

All tools (except AI assistance) run entirely in your browser. No data is sent to external servers unless explicitly requested (e.g., when using the AI Expert).
