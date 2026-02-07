export interface Corpus {
  id: string;
  name: string;
}

export interface BookInfo {
  name: string;
  chapters: number;
}

export interface WordInfo {
  monad: number;
  text: string;
  trailer: string;
  lexeme: string;
  lexeme_utf8: string;
  gloss: string;
  part_of_speech: string;
  gender: string;
  number: string;
  person: string;
  state: string;
  verbal_stem: string;
  verbal_tense: string;
  language: string;
}

export interface VerseResult {
  book: string;
  chapter: number;
  verse: number;
  words: WordInfo[];
}

export interface PassageResult {
  corpus: string;
  verses: VerseResult[];
}

/** Which grammar features can be toggled on/off in the display. */
export type GrammarFeature = keyof Pick<
  WordInfo,
  | "gloss"
  | "part_of_speech"
  | "gender"
  | "number"
  | "person"
  | "state"
  | "verbal_stem"
  | "verbal_tense"
  | "lexeme"
>;

export const GRAMMAR_FEATURES: { key: GrammarFeature; label: string }[] = [
  { key: "gloss", label: "Gloss" },
  { key: "part_of_speech", label: "Part of Speech" },
  { key: "lexeme", label: "Lexeme" },
  { key: "gender", label: "Gender" },
  { key: "number", label: "Number" },
  { key: "person", label: "Person" },
  { key: "state", label: "State" },
  { key: "verbal_stem", label: "Verbal Stem" },
  { key: "verbal_tense", label: "Verbal Tense" },
];

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  result: unknown;
}

export interface ChatResponse {
  reply: string;
  tool_calls: ToolCall[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
}

// --- Quiz types ---

export type FeatureVisibility = "show" | "request" | "hide";

export interface FeatureConfig {
  name: string;
  visibility: FeatureVisibility;
}

export interface QuizDefinition {
  id: string;
  title: string;
  description: string;
  corpus: string;
  book: string;
  chapter_start: number;
  chapter_end: number;
  verse_start: number | null;
  verse_end: number | null;
  search_template: string;
  features: FeatureConfig[];
  randomize: boolean;
  max_questions: number;
  time_limit_seconds: number;
  context_verses: number;
}

export interface QuizSummary {
  id: string;
  title: string;
  corpus: string;
  book: string;
}

export interface QuizQuestion {
  index: number;
  book: string;
  chapter: number;
  verse: number;
  word_text: string;
  word_text_utf8: string;
  shown_features: Record<string, string>;
  requested_features: Record<string, string>;
}

export interface QuizSession {
  quiz_id: string;
  quiz_title: string;
  questions: QuizQuestion[];
  time_limit_seconds: number;
}

/** Feature names available for quiz configuration. */
export const QUIZ_FEATURE_OPTIONS: { key: string; label: string }[] = [
  { key: "gloss", label: "Gloss" },
  { key: "part_of_speech", label: "Part of Speech" },
  { key: "lexeme", label: "Lexeme" },
  { key: "gender", label: "Gender" },
  { key: "number", label: "Number" },
  { key: "person", label: "Person" },
  { key: "state", label: "State" },
  { key: "verbal_stem", label: "Verbal Stem" },
  { key: "verbal_tense", label: "Verbal Tense" },
];
