# DevTools Workspace v1.0

A high-performance, personalized developer dashboard designed for modern engineers. This workspace provides a suite of tools for development, design, and utility tasks, all running client-side for maximum speed and privacy.

## 🚀 Features

- **Modular Tool Registry**: 40+ specialized engineering tools across Security, Data, Design, and DevOps.
- **AI-Powered Pipeline Engine**: Decomposes natural language intent into executable tool sequences using Gemini.
- **Capability-Based Matching**: One-to-one mapping between atomic capabilities and canonical tools for deterministic planning.
- **Smart DevToolbox**: Drag-and-drop widgets with state persistence via LocalStorage (Mock Firestore).
- **Client-Side Security**: All data transformations run 100% in the browser.
- **Tool Certification**: Automated scoring system for tool completeness and pipeline safety.
- **Mobile-First Design**: Fully responsive layout built with Tailwind CSS.

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
