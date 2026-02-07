# BibleOL

A web-based Biblical language learning platform for exploring Hebrew and Greek texts with grammar annotations, an AI chat assistant, and interactive quizzes.

## Features

- **Passage Browser** -- Navigate biblical texts by corpus, book, chapter, and verse range. Supports Hebrew (BHSA) and Greek (Nestle 1904) corpora.
- **Grammar Annotations** -- Toggle nine grammar features per word: gloss, part of speech, lexeme, gender, number, person, state, verbal stem, and verbal tense. Click any word for a full grammatical popup.
- **AI Chat** -- Ask questions about the displayed text (e.g. "What verbs appear in Genesis 1:1?", "Find all hiphil imperatives"). The backend executes search tools and returns structured results.
- **Quiz System** -- Create quizzes from specific passages using Text-Fabric search templates. Configure which grammar features are shown as context and which are requested as answers. Students answer with radio buttons or text input and receive automatic scoring with detailed feedback.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and builds
- **Tailwind CSS** for styling
- **React Router** for SPA routing
- **Netlify** for deployment

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/)
- A running instance of the BibleOL API backend (default: `http://localhost:8000`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`. API requests are proxied to `http://localhost:8000` during development.

## Environment Variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | API base URL (without trailing slash). Leave empty for local dev with Vite proxy. | _(empty)_ |

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |

## Project Structure

```
src/
  api/client.ts          API client functions
  types/api.ts           TypeScript types for API responses
  components/
    CorpusSelector.tsx   Language corpus dropdown
    BookSelector.tsx     Book, chapter, and verse selectors
    GrammarPanel.tsx     Grammar feature toggles
    PassageView.tsx      Bible text display with word annotations
    WordSpan.tsx         Individual word with grammar popup
    ChatPanel.tsx        AI chat interface
    ChatMessage.tsx      Chat message display
    quiz-editor/         Quiz creation and editing
    quiz-runner/         Quiz execution and results
  App.tsx                Main text display page
  main.tsx               App entry point with routing
```

## Deployment

The project is configured for Netlify deployment via `netlify.toml`. Push to the main branch to trigger a deploy, or run manually:

```bash
pnpm build
```

The build output in `dist/` is ready to be served as a static site.

## License

[MIT](LICENSE)
