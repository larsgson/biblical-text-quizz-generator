import { useEffect, useState } from "react";
import type { LexemeLookupResult } from "../types/api";
import { fetchLexeme } from "../api/client";

interface Props {
  lexeme: string;
  corpus: string;
  onClose: () => void;
}

export default function LexemeModal({ lexeme, corpus, onClose }: Props) {
  const [result, setResult] = useState<LexemeLookupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchLexeme(lexeme, corpus)
      .then(setResult)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load lexeme"),
      )
      .finally(() => setLoading(false));
  }, [lexeme, corpus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isRtl = corpus === "hebrew";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b p-4">
          <div>
            <h2
              className="text-xl font-bold"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {result?.lexeme_utf8 || lexeme}
            </h2>
            {result && (
              <p className="mt-1 text-sm text-gray-600">
                {result.gloss} &middot; {result.part_of_speech} &middot;{" "}
                {result.total_occurrences} total occurrences
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            &#10005;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {result && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Reference</th>
                  <th className="pb-2 pr-4">Word</th>
                  <th className="pb-2 pr-4">Gloss</th>
                  <th className="pb-2">Form</th>
                </tr>
              </thead>
              <tbody>
                {result.occurrences.map((occ, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-1.5 pr-4 text-gray-600">
                      {occ.book} {occ.chapter}:{occ.verse}
                    </td>
                    <td
                      className="py-1.5 pr-4 font-medium"
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      {occ.word.text}
                    </td>
                    <td className="py-1.5 pr-4">{occ.word.gloss}</td>
                    <td className="py-1.5 text-gray-500">
                      {[
                        occ.word.part_of_speech,
                        occ.word.verbal_stem,
                        occ.word.verbal_tense,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {result &&
            result.occurrences.length < result.total_occurrences && (
              <p className="mt-3 text-xs text-gray-400">
                Showing {result.occurrences.length} of{" "}
                {result.total_occurrences} occurrences
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
