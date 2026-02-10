import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BookInfo, WordSearchFeatures, WordSearchResult } from "../types/api";
import { fetchBooks, searchWords } from "../api/client";
import CorpusSelector from "./CorpusSelector";

const FEATURE_OPTIONS: { key: keyof WordSearchFeatures; label: string; values: string[] }[] = [
  {
    key: "part_of_speech",
    label: "Part of Speech",
    values: ["verb", "noun", "adjective", "adverb", "preposition", "conjunction", "pronoun", "article", "particle", "interjection"],
  },
  {
    key: "verbal_stem",
    label: "Verbal Stem",
    values: ["qal", "niphal", "piel", "pual", "hiphil", "hophal", "hithpael"],
  },
  {
    key: "verbal_tense",
    label: "Verbal Tense",
    values: ["perfect", "imperfect", "wayyiqtol", "imperative", "infinitive_construct", "infinitive_absolute", "participle"],
  },
  { key: "gender", label: "Gender", values: ["masculine", "feminine", "common"] },
  { key: "number", label: "Number", values: ["singular", "plural", "dual"] },
  { key: "person", label: "Person", values: ["first", "second", "third"] },
  { key: "state", label: "State", values: ["absolute", "construct", "determined"] },
];

export default function WordSearch() {
  const [corpus, setCorpus] = useState("hebrew");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState<string>("");
  const [features, setFeatures] = useState<WordSearchFeatures>({});
  const [limit, setLimit] = useState(100);
  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchBooks(corpus).then(setBooks);
  }, [corpus]);

  const handleCorpusChange = (c: string) => {
    setCorpus(c);
    setBook("");
    setChapter("");
    setResults([]);
    setSearched(false);
  };

  const setFeature = (key: keyof WordSearchFeatures, value: string) => {
    setFeatures((prev) => {
      const next = { ...prev };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const handleSearch = async () => {
    const activeFeatures = Object.keys(features).length;
    if (activeFeatures === 0 && !book) {
      setError("Select at least one feature filter or a book");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const request = {
        corpus,
        features,
        limit,
        ...(book ? { book } : {}),
        ...(chapter ? { chapter: Number(chapter) } : {}),
      };
      const data = await searchWords(request);
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const isRtl = corpus === "hebrew";
  const selectClass = "rounded border border-gray-300 px-2 py-1 text-sm";

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Word Search</h1>
        <Link
          to="/"
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Text Display
        </Link>
      </div>

      {/* Search form */}
      <div className="mb-6 rounded border border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <CorpusSelector value={corpus} onChange={handleCorpusChange} />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Book</label>
            <select
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className={selectClass}
            >
              <option value="">All books</option>
              {books.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {book && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Ch.</label>
              <input
                type="number"
                min={1}
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="All"
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Limit</label>
            <input
              type="number"
              min={1}
              max={500}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          {FEATURE_OPTIONS.map(({ key, label, values }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{label}</label>
              <select
                value={features[key] || ""}
                onChange={(e) => setFeature(key, e.target.value)}
                className={selectClass}
              >
                <option value="">Any</option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {searched && !loading && !error && (
        <div className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-600">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </h2>

          {results.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Reference</th>
                  <th className="pb-2 pr-4">Word</th>
                  <th className="pb-2 pr-4">Gloss</th>
                  <th className="pb-2 pr-4">POS</th>
                  <th className="pb-2 pr-4">Stem</th>
                  <th className="pb-2 pr-4">Tense</th>
                  <th className="pb-2">Form</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-1.5 pr-4 text-gray-600">
                      {r.book} {r.chapter}:{r.verse}
                    </td>
                    <td
                      className="py-1.5 pr-4 font-medium"
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      {r.word.text}
                    </td>
                    <td className="py-1.5 pr-4">{r.word.gloss}</td>
                    <td className="py-1.5 pr-4 text-gray-500">
                      {r.word.part_of_speech}
                    </td>
                    <td className="py-1.5 pr-4 text-gray-500">
                      {r.word.verbal_stem}
                    </td>
                    <td className="py-1.5 pr-4 text-gray-500">
                      {r.word.verbal_tense}
                    </td>
                    <td className="py-1.5 text-gray-500">
                      {[r.word.gender, r.word.number, r.word.person]
                        .filter(Boolean)
                        .join(" ")}
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
