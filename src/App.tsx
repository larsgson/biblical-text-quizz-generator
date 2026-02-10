import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { GrammarFeature, VerseResult } from "./types/api";
import { fetchPassage } from "./api/client";
import CorpusSelector from "./components/CorpusSelector";
import BookSelector from "./components/BookSelector";
import GrammarPanel from "./components/GrammarPanel";
import PassageView from "./components/PassageView";
import VocabularyPanel from "./components/VocabularyPanel";
import LexemeModal from "./components/LexemeModal";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [corpus, setCorpus] = useState("hebrew");
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(5);
  const [verses, setVerses] = useState<VerseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enabledFeatures, setEnabledFeatures] = useState<Set<GrammarFeature>>(
    new Set(["gloss"]),
  );
  const [chatOpen, setChatOpen] = useState(true);
  const [selectedLexeme, setSelectedLexeme] = useState<string | null>(null);

  const loadPassage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchPassage(
        corpus,
        book,
        chapter,
        verseStart,
        verseEnd,
      );
      setVerses(result.verses);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load passage");
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [corpus, book, chapter, verseStart, verseEnd]);

  useEffect(() => {
    loadPassage();
  }, [loadPassage]);

  const toggleFeature = (f: GrammarFeature) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const handleCorpusChange = (c: string) => {
    setCorpus(c);
    setChapter(1);
    setVerseStart(1);
    setVerseEnd(5);
  };

  return (
    <div className="flex h-screen">
      {/* Text display panel */}
      <div className={`flex-1 overflow-y-auto p-4 ${chatOpen ? "" : ""}`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Biblical Text Quizz Generator
            </h1>
            <div className="flex gap-2">
              <Link
                to="/search"
                className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              >
                Search
              </Link>
              <Link
                to="/quizzes"
                className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              >
                Quizzes
              </Link>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              >
                {chatOpen ? "Hide Chat" : "Show Chat"}
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            <CorpusSelector value={corpus} onChange={handleCorpusChange} />
            <BookSelector
              corpus={corpus}
              book={book}
              chapter={chapter}
              verseStart={verseStart}
              verseEnd={verseEnd}
              onBookChange={setBook}
              onChapterChange={setChapter}
              onVerseStartChange={setVerseStart}
              onVerseEndChange={setVerseEnd}
            />
          </div>

          <div className="mb-4 rounded bg-gray-50 p-3">
            <h2 className="mb-2 text-sm font-semibold text-gray-600">
              Grammar Features
            </h2>
            <GrammarPanel enabled={enabledFeatures} onToggle={toggleFeature} />
          </div>

          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="rounded border border-gray-200 bg-white p-4">
            <PassageView
              verses={verses}
              corpus={corpus}
              enabledFeatures={enabledFeatures}
              onLexemeClick={setSelectedLexeme}
            />
          </div>

          <div className="mt-4">
            <VocabularyPanel
              corpus={corpus}
              book={book}
              chapter={chapter}
              verseStart={verseStart}
              verseEnd={verseEnd}
              onLexemeClick={setSelectedLexeme}
            />
          </div>
        </div>
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <div className="w-96 shrink-0 border-l border-gray-200 bg-white">
          <ChatPanel />
        </div>
      )}

      {/* Lexeme lookup modal */}
      {selectedLexeme && (
        <LexemeModal
          lexeme={selectedLexeme}
          corpus={corpus}
          onClose={() => setSelectedLexeme(null)}
        />
      )}
    </div>
  );
}
