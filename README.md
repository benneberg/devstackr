# DevTools Workspace v1.0

A high-performance, personalized developer dashboard designed for modern engineers. This workspace provides a suite of tools for development, design, and utility tasks, all running client-side for maximum speed and privacy.

## 🚀 Features

- **Modular Tool Registry**: Easily add and manage custom tools.
- **Advanced Storage Manager**: Inspect and manage LocalStorage and IndexedDB in real-time.
- **AI Expert Assistant**: Specialized AI roles for scraping, security, and architecture (Powered by Gemini).
- **Video Metadata Management**: Presets and custom profiles for video encoding with FFmpeg command generation.
- **GitHub Template Library**: Best practice repository structures for various project types.
- **Mobile-First Design**: Fully responsive layout built with Tailwind CSS.

## 🛠️ Project Structure

```text
/
├── components/
│   ├── tools/          # Individual tool implementations
│   ├── toolbox/        # Quick-access toolbox components
│   └── ui/             # Reusable UI primitives
├── data/
│   └── tools.ts        # Central tool metadata and registry definitions
├── pages/
│   ├── Dashboard.tsx   # Main overview and stats
│   ├── ToolCatalog.tsx # Searchable list of all tools
│   └── ToolDetail.tsx  # Dedicated view for individual tools
├── contexts/           # React contexts (User, etc.)
└── App.tsx             # Main application shell and routing
```

## 🛠️ Documentation

For detailed technical information on the architecture, tool system, and pipeline engine, please refer to the [TECHNICAL_README.md](./TECHNICAL_README.md).

## 🛠️ Adding a New Tool

1. **Create Component**: Add your tool UI/logic in `src/components/tools/`.
2. **Define Metadata**: Add the tool's metadata to `src/data/tools.ts`.
3. **Implement `run`**: If the tool is intended for use in pipelines, implement the `run` function in its metadata.
4. **Register Widget**: If `isWidget` is true, add the component to the `WIDGET_COMPONENTS` map in `src/components/toolbox/ToolboxPanel.tsx`.

## 📦 Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS** for styling
- **Lucide React** for iconography
- **Framer Motion** for animations
- **Google Generative AI** for expert assistance

## 🔐 Security & Privacy

All tools (except AI assistance) run entirely in your browser. No data is sent to external servers unless explicitly requested (e.g., when using the AI Expert).
