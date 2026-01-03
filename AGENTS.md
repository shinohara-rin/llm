# AGENTS.md

## Project Context
**Name**: LLM (Lo-Fi Looping Machine)
**Goal**: Browser-based generative music station using AudioWorklets + LLM code generation.

## Key Features
- **Live Coding**: Visualizes the code generation process in a Matrix-style terminal.
- **Custom Model Selection**: Supports switching between LLM models (OpenAI/Gemini) dynamically via the Settings modal.
- **Procedural Audio**: All sounds synthesized in real-time via generated AudioWorklets; no samples used.

## Tech Stack
- **Package Manager**: `pnpm`
- **Build Tool**: Vite
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS v4
- **LLM Library**: `xsai` (Generic wrapper for OpenAI/Gemini)
- **Audio**: Native Web Audio API (`AudioContext`, `AudioWorklet`)

## Key Architecture Decisions

### 1. No Framework & Native Audio
We use Vanilla JS to avoid framework overhead when handling high-performance AudioContext operations.
- **Entry**: `index.html` + `src/main.js` bootstraps the app.
- **Components**: Simple classes (`Deck`, `Terminal`, `Visualizer`) managing their own DOM elements.

### 2. Generative AudioWorklets
The LLM writes the `process()` function for `AudioWorkletProcessor` to synthesize sound from scratch (Sine waves, Noise, etc.).
- **Dynamic Loading**: Code is wrapped in a `Blob` and loaded via `URL.createObjectURL`.
- **Collision Avoidance**: Since `AudioWorkletGlobalScope` is shared, we cannot register the same processor name twice.
  - **Patching**: We use Regex in `deck.js` to rename the generated class (e.g., `ProceduralGen_kick`) and registration key (e.g., `kick-gen`) before loading.

### 3. LLM Integration (xsai)
We use `xsai` for its lightweight browser support and streaming capabilities.
- **Client**: `src/llm/client.js` wraps `xsai` calls.
- **Streaming**: We use `streamText` to pipe the raw generated code character-by-character to the UI Terminal for a "Matrix" effect.
- **Model Selection**: Users can select models dynamically. We fetch the list via `GET /models` using the provided Base URL.

### 4. Scheduler
A Lookahead Scheduler (`src/audio/scheduler.js`) ensures precise rhythmic timing by scheduling audio events slightly into the future (0.1s), unaffected by the main thread's UI latency.

## Prompt Engineering Strategy
To ensure the LLM generates valid, runnable code:
- **System Prompts** (`src/llm/prompts.js`): We enforce strict constraints:
  - No external libraries (Pure JS math only).
  - Must extend `AudioWorkletProcessor`.
  - Input/Output handling must follow Web Audio API standards.
- **Specific Instruments**: We provide targeted prompts for Kick (Sine sweep), Snare (Noise filter), and HiHat (High-pass noise) to guide the DSP logic.

## Configuration Persistence
- **Storage**: `localStorage` key `lofi_llm_config`.
- **Data**: Stores `{ apiKey, baseURL, model }`.
- **Privacy**: Keys are stored only in the browser, never sent to our servers.

## Design System (Retro Synthwave)
- **Colors**: Neon Purple (#b026ff), Cyan (#00e9ff), Dark Grid (#0f0518).
- **Font**: Monospace (Courier New / VT323).
- **Vibe**: CRT Scanlines (CSS overlay), Glowing text, Terminal logs.

## Styles & Tailwind v4
This project uses **Tailwind CSS v4**.
- **Config**: Defined directly in `src/style.css` using the `@theme` directive, not `tailwind.config.js`.
- **Directives**: Uses `@import "tailwindcss";` instead of the old `@tailwind base;` directives.
- **Custom animations**: Scanlines and glows are implemented as standard CSS classes in `style.css` extending the tailwind layer.

## Future Improvements
- **Ambience Generator**: Procedural rain/vinyl crackle using noise buffers.
- **Save/Load Loops**: Persist the generated `sequence` JSON to localStorage or a database.
- **Polyphony**: Upgrade the chord synth worklet to support true polyphony (currently monophonic or simple paraphonic depending on generation).

## Setup & Commands
- **Install**: `pnpm install`
- **Dev**: `pnpm dev`
- **Build**: `pnpm build`

## Debugging Tips
- **Audio Context**: Browsers suspend AudioContext until user interaction. We auto-resume on the first 'GENERATE' click.
- **Terminal Logs**: The on-screen terminal shows the internal state. Use `deck.js` to log extra debug info there.

## Directory Structure
```
src/
  audio/
    engine.js       # Main AudioContext & Master Bus
    scheduler.js    # Lookahead Scheduler for timing
    worklet_loader.js # Dynamic Blob loading utility
  llm/
    client.js       # xsai API wrapper & fetchModels
    prompts.js      # System prompts for Worklets & composition
  ui/
    deck.js         # Main Controller (Logic Core)
    terminal.js     # Matrix-style logger
    settings.js     # Config modal logic
    visualizer.js   # Canvas frequency analyzer
  main.js           # App bootstrapping
  style.css         # Tailwind & Custom CSS
```
