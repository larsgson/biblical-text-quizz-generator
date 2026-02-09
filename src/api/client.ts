import type {
  BookInfo,
  ChatResponse,
  Corpus,
  PassageResult,
  QuizDefinition,
  QuizSession,
  QuizSummary,
} from "../types/api";

const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function get<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const base = path.startsWith("http") ? path : window.location.origin + path;
  const url = new URL(base);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

export async function fetchCorpora(): Promise<Corpus[]> {
  return get<Corpus[]>(`${BASE}/corpora`);
}

export async function fetchBooks(corpus: string): Promise<BookInfo[]> {
  return get<BookInfo[]>(`${BASE}/books`, { corpus });
}

export async function fetchPassage(
  corpus: string,
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number,
): Promise<PassageResult> {
  const params: Record<string, string | number> = {
    corpus,
    book,
    chapter,
    verse_start: verseStart,
  };
  if (verseEnd !== undefined) params.verse_end = verseEnd;
  return get<PassageResult>(`${BASE}/passage`, params);
}

export function getChatPassword(): string | null {
  return sessionStorage.getItem("chat-password");
}

export function setChatPassword(password: string): void {
  sessionStorage.setItem("chat-password", password);
}

export async function sendChat(
  message: string,
  history?: { role: string; content: string }[],
): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const password = getChatPassword();
  if (password) headers["x-app-password"] = password;

  const resp = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, history }),
  });
  if (resp.status === 401) throw new Error("UNAUTHORIZED");
  if (!resp.ok) throw new Error(`Chat API ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

export async function chatQuiz(
  message: string,
  history?: { role: string; content: string }[],
): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const password = getChatPassword();
  if (password) headers["x-app-password"] = password;

  const resp = await fetch(`${BASE}/chat-quiz`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, history }),
  });
  if (resp.status === 401) throw new Error("UNAUTHORIZED");
  if (!resp.ok)
    throw new Error(`Chat Quiz API ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

// --- Quiz API ---

async function post<T>(path: string, body: unknown): Promise<T> {
  const resp = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  return get<QuizSummary[]>(`${BASE}/quizzes`);
}

export async function fetchQuiz(id: string): Promise<QuizDefinition> {
  return get<QuizDefinition>(`${BASE}/quizzes/${id}`);
}

export async function createQuiz(
  quiz: Partial<QuizDefinition>,
): Promise<QuizDefinition> {
  return post<QuizDefinition>(`${BASE}/quizzes`, quiz);
}

export async function updateQuiz(
  id: string,
  quiz: QuizDefinition,
): Promise<QuizDefinition> {
  const resp = await fetch(`${BASE}/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);
  return resp.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  const resp = await fetch(`${BASE}/quizzes/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);
}

export async function generateQuizSession(id: string): Promise<QuizSession> {
  return post<QuizSession>(`${BASE}/quizzes/${id}/generate`, {});
}
