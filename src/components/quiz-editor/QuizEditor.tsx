import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { QuizDefinition, QuizSession } from "../../types/api";
import {
  fetchQuiz,
  updateQuiz,
  generateQuizSession,
  fetchBooks,
} from "../../api/client";
import type { BookInfo } from "../../types/api";
import FeatureSelector from "./FeatureSelector";

export default function QuizEditor() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizDefinition | null>(null);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [preview, setPreview] = useState<QuizSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchQuiz(id)
        .then(setQuiz)
        .catch((e) => setError(e.message));
    }
  }, [id]);

  useEffect(() => {
    if (quiz) {
      fetchBooks(quiz.corpus).then(setBooks);
    }
  }, [quiz?.corpus]);

  const update = <K extends keyof QuizDefinition>(
    key: K,
    value: QuizDefinition[K],
  ) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [key]: value });
  };

  const handleSave = async () => {
    if (!quiz || !id) return;
    setSaving(true);
    setError("");
    try {
      const saved = await updateQuiz(id, quiz);
      setQuiz(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!id) return;
    setTesting(true);
    setError("");
    setPreview(null);
    try {
      await handleSave();
      const session = await generateQuizSession(id);
      setPreview(session);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Test failed");
    } finally {
      setTesting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    );
  }

  const selectClass = "rounded border border-gray-300 px-2 py-1 text-sm";
  const inputClass = "rounded border border-gray-300 px-2 py-1 text-sm";
  const maxChapter = books.find((b) => b.name === quiz.book)?.chapters ?? 150;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>
        <div className="flex gap-2">
          <Link
            to="/quizzes"
            className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
          >
            Back
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleTest}
            disabled={testing}
            className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {testing ? "Testing... (may take a moment)" : "Test"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      {/* Title & Description */}
      <section className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">General</h2>
        <div className="space-y-2">
          <input
            value={quiz.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Quiz title"
            className={`${inputClass} w-full`}
          />
          <textarea
            value={quiz.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className={`${inputClass} w-full resize-none`}
          />
        </div>
      </section>

      {/* Passage Selection */}
      <section className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">Passage</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={quiz.corpus}
            onChange={(e) => update("corpus", e.target.value)}
            className={selectClass}
          >
            <option value="hebrew">Hebrew (BHSA)</option>
            <option value="greek">Greek (Nestle 1904)</option>
          </select>

          <select
            value={quiz.book}
            onChange={(e) => update("book", e.target.value)}
            className={selectClass}
          >
            {books.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-600">Ch.</label>
          <input
            type="number"
            min={1}
            max={maxChapter}
            value={quiz.chapter_start}
            onChange={(e) => {
              const v = Number(e.target.value);
              update("chapter_start", v);
              if (quiz.chapter_end < v) update("chapter_end", v);
            }}
            className={`${inputClass} w-16`}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min={quiz.chapter_start}
            max={maxChapter}
            value={quiz.chapter_end}
            onChange={(e) => update("chapter_end", Number(e.target.value))}
            className={`${inputClass} w-16`}
          />

          <label className="text-sm text-gray-600">Vs.</label>
          <input
            type="number"
            min={1}
            value={quiz.verse_start ?? ""}
            onChange={(e) =>
              update(
                "verse_start",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="all"
            className={`${inputClass} w-16`}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min={quiz.verse_start ?? 1}
            value={quiz.verse_end ?? ""}
            onChange={(e) =>
              update(
                "verse_end",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="all"
            className={`${inputClass} w-16`}
          />
        </div>
      </section>

      {/* Search Template */}
      <section className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">
          Search Template
        </h2>
        <p className="mb-2 text-xs text-gray-400">
          Text-Fabric search template. e.g. "word sp=verb" finds all verbs,
          "word sp=verb vs=hif" finds hiphil verbs.
        </p>
        <textarea
          value={quiz.search_template}
          onChange={(e) => update("search_template", e.target.value)}
          rows={3}
          className={`${inputClass} w-full font-mono`}
        />
      </section>

      {/* Feature Configuration */}
      <section className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">Features</h2>
        <p className="mb-2 text-xs text-gray-400">
          Show = visible as context. Request = student must answer. Hide = not
          shown.
        </p>
        <FeatureSelector
          features={quiz.features}
          onChange={(f) => update("features", f)}
        />
      </section>

      {/* Settings */}
      <section className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-600">Settings</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={quiz.randomize}
              onChange={(e) => update("randomize", e.target.checked)}
            />
            Randomize
          </label>
          <label className="flex items-center gap-1">
            Max questions:
            <input
              type="number"
              min={0}
              value={quiz.max_questions}
              onChange={(e) => update("max_questions", Number(e.target.value))}
              className={`${inputClass} w-16`}
            />
          </label>
          <label className="flex items-center gap-1">
            Time limit (sec):
            <input
              type="number"
              min={0}
              value={quiz.time_limit_seconds}
              onChange={(e) =>
                update("time_limit_seconds", Number(e.target.value))
              }
              className={`${inputClass} w-20`}
            />
          </label>
        </div>
      </section>

      {/* Test Preview */}
      {preview && (
        <section className="mb-4 rounded border border-green-200 bg-green-50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-green-700">
            Preview: {preview.questions.length} question
            {preview.questions.length !== 1 ? "s" : ""} generated
          </h2>
          {preview.questions.length === 0 ? (
            <p className="text-sm text-amber-700">
              No questions generated. Make sure at least one feature is set to
              "request" and the search template matches words in the selected
              passage.
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              {preview.questions.slice(0, 5).map((q) => (
                <div
                  key={q.index}
                  className="rounded bg-white p-2 border border-green-100"
                >
                  <div className="font-medium">
                    {q.book} {q.chapter}:{q.verse} &mdash;{" "}
                    <span className="text-lg">{q.word_text}</span>
                  </div>
                  <div className="text-gray-500">
                    Shown:{" "}
                    {Object.entries(q.shown_features)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(", ") || "none"}
                  </div>
                  <div className="text-blue-600">
                    Ask:{" "}
                    {Object.keys(q.requested_features)
                      .map((k) => `${k}=?`)
                      .join(", ")}
                  </div>
                </div>
              ))}
              {preview.questions.length > 5 && (
                <p className="text-gray-400 italic">
                  ...and {preview.questions.length - 5} more
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
