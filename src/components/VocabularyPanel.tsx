import { useCallback, useEffect, useState } from "react";
import type { VocabularyEntry } from "../types/api";
import { fetchVocabulary } from "../api/client";

interface Props {
  corpus: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  onLexemeClick: (lexeme: string) => void;
}

export default function VocabularyPanel({
  corpus,
  book,
  chapter,
  verseStart,
  verseEnd,
  onLexemeClick,
}: Props) {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchVocabulary(
        corpus,
        book,
        chapter,
        verseStart,
        verseEnd,
      );
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load vocabulary");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [corpus, book, chapter, verseStart, verseEnd]);

  useEffect(() => {
    load();
  }, [load]);

  const isRtl = corpus === "hebrew";

  return (
    <div className="rounded border border-gray-200 bg-white">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-600 hover:bg-gray-100"
      >
        <span className="text-xs">{collapsed ? "\u25B6" : "\u25BC"}</span>
        Vocabulary ({entries.length} unique lexemes)
      </button>

      {!collapsed && (
        <div className="p-4">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && entries.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Lexeme</th>
                  <th className="pb-2 pr-4">Gloss</th>
                  <th className="pb-2 pr-4">POS</th>
                  <th className="pb-2 pr-4 text-right">In passage</th>
                  <th className="pb-2 text-right">In corpus</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.lexeme}
                    className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-blue-50"
                    onClick={() => onLexemeClick(entry.lexeme)}
                  >
                    <td
                      className="py-1.5 pr-4 font-medium"
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      {entry.lexeme_utf8}
                    </td>
                    <td className="py-1.5 pr-4">{entry.gloss}</td>
                    <td className="py-1.5 pr-4 text-gray-500">
                      {entry.part_of_speech}
                    </td>
                    <td className="py-1.5 pr-4 text-right">{entry.count}</td>
                    <td className="py-1.5 text-right">
                      {entry.corpus_frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
