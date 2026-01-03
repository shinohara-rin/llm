# AGENTS.md

## Project Context
**Name**: LLM (Lo-Fi Looping Machine)
**Goal**: Browser-based generative music station using AudioWorklets + LLM code generation.

## Tech Stack
- **Package Manager**: `pnpm`
- **Build Tool**: Vite
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS v4
- **LLM Library**: `xsai` (Generic wrapper for OpenAI/Gemini)
- **Audio**: Native Web Audio API (`AudioContext`, `AudioWorklet`)

## Key Architecture Decisions
- **No Framework**: We use Vanilla JS to avoid overhead when handling high-performance AudioContext operations.
- **AudioWorklets**: The LLM writes `process()` functions for `AudioWorkletProcessor`. We dynamic-load these via `Blob` URLs.
- **xsai**: Used for `generateText` (control) and `streamText` (code generation visualization).

## Design System (Retro Synthwave)
- **Colors**: Neon Purple (`#b026ff`), Cyan (`#00e9ff`), Dark Grid (`#0f0518`).
- **Font**: Monospace (Courier New / VT323 equivalent).
- **Vibe**: CRT Scanlines, Glowing text, Matrix-style code streaming.
