# Biblical Text Quizz Generator

A web-based Biblical language learning platform for exploring Hebrew and Greek texts with grammar annotations, an AI chat assistant, and interactive quizzes.

**Live demo:** [quizz-bible-text.netlify.app](https://quizz-bible-text.netlify.app/)

**Backend:** [larsgson/text-fabric-mcp](https://github.com/larsgson/text-fabric-mcp)

## Features

- **Passage Browser** -- Navigate biblical texts by corpus, book, chapter, and verse range. Supports Hebrew (BHSA) and Greek (Nestle 1904) corpora.
- **Grammar Annotations** -- Toggle nine grammar features per word: gloss, part of speech, lexeme, gender, number, person, state, verbal stem, and verbal tense. Click any word for a full grammatical popup.
- **Vocabulary Panel** -- Collapsible panel below the passage showing unique lexemes sorted by corpus frequency, with passage count and corpus-wide frequency. Click any lexeme to see all its occurrences.
- **Lexeme Lookup** -- Click any word in the passage or vocabulary panel to open a modal showing all occurrences of that lexeme across the corpus, with references and morphological details.
- **Word Search** -- Dedicated search page (`/search`) for finding words by morphological features: part of speech, verbal stem, verbal tense, gender, number, person, and state. Filter by corpus, book, and chapter.
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
- A running instance of the API backend (default: `http://localhost:8000`)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`. API requests are proxied to `http://localhost:8000` during development.

## Environment Variables

No environment variables are needed for local development. Vite proxies `/api/*` requests to `http://localhost:8000` automatically.

For production, see [Deployment](#deployment).

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
    VocabularyPanel.tsx  Passage vocabulary list with frequencies
    LexemeModal.tsx      Lexeme occurrence lookup modal
    WordSearch.tsx       Morphological word search page
    ChatPanel.tsx        AI chat interface
    ChatMessage.tsx      Chat message display
    quiz-editor/         Quiz creation and editing
    quiz-runner/         Quiz execution and results
  App.tsx                Main text display page
  main.tsx               App entry point with routing
```

## API Endpoints

All frontend requests are proxied through the Netlify Edge Function to the Railway backend. The API client is defined in `src/api/client.ts`.

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/corpora` | GET | List available text corpora (BHSA, Nestle 1904) | None |
| `/api/books?corpus=...` | GET | List books for a given corpus | None |
| `/api/passage?corpus=...&book=...&chapter=...&verse_start=...` | GET | Fetch passage text with word-level grammar data | None |
| `/api/vocabulary?corpus=...&book=...&chapter=...` | GET | Unique lexemes in a passage sorted by corpus frequency | None |
| `/api/lexeme/{lexeme}?corpus=...` | GET | Lexeme lookup with all occurrences across the corpus | None |
| `/api/search/words` | POST | Search words by morphological features (POS, stem, tense, etc.) | None |
| `/api/chat` | POST | AI chat — sends a message and returns a structured reply with optional tool calls | Password |
| `/api/chat-quiz` | POST | AI quiz builder — describe a quiz in natural language, AI builds and validates it | Password |
| `/api/quizzes` | GET | List all saved quiz definitions | None |
| `/api/quizzes` | POST | Create a new quiz definition | None |
| `/api/quizzes/{id}` | GET | Fetch a single quiz definition | None |
| `/api/quizzes/{id}` | PUT | Update a quiz definition | None |
| `/api/quizzes/{id}` | DELETE | Delete a quiz definition | None |
| `/api/quizzes/{id}/generate` | POST | Generate a quiz session with questions from a definition | None |

**Auth column:** "Password" means the user must enter the app password before the request is allowed through. The edge function checks the `x-app-password` header against the `APP_PASSWORD` environment variable. Only `/api/chat` and `/api/chat-quiz` are gated because they incur AI API costs.

## Deployment

The frontend is deployed on **Netlify** and connects to a backend API on **Railway**. A Netlify Edge Function proxies `/api/*` requests to Railway and injects an API key server-side, so no secrets are exposed to the browser.

### Netlify setup

1. Connect your repository to Netlify. The build settings are configured in `netlify.toml` (`pnpm build`, publish `dist/`).

2. Set environment variables in **Site settings > Environment variables**:

   | Variable | Description |
   |----------|-------------|
   | `API_URL` | Railway backend URL, e.g. `https://your-app.railway.app` (no trailing slash) |
   | `API_KEY` | Shared secret matching the backend's API key |
   | `APP_PASSWORD` | Password users must enter to use the AI chat (protects against unwanted API costs) |

3. Deploy. The edge function at `netlify/edge-functions/api-proxy.ts` handles API proxying automatically. The chat endpoint (`/api/chat`) is password-gated; all other endpoints are open.

## License

[MIT](LICENSE)
