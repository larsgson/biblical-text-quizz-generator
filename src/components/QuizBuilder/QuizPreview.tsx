import type { QuizDefinition } from "../../types/api";

interface Props {
  quiz: QuizDefinition;
  questionCount: number;
  onSave: () => void;
  saving: boolean;
}

export default function QuizPreview({
  quiz,
  questionCount,
  onSave,
  saving,
}: Props) {
  const shown = quiz.features
    .filter((f) => f.visibility === "show")
    .map((f) => f.name);
  const requested = quiz.features
    .filter((f) => f.visibility === "request")
    .map((f) => f.name);

  const scope =
    quiz.chapter_start === quiz.chapter_end
      ? `${quiz.book} ${quiz.chapter_start}`
      : `${quiz.book} ${quiz.chapter_start}-${quiz.chapter_end}`;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-gray-700">Quiz Preview</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <div className="rounded border border-gray-200 bg-white p-4">
            <h3 className="mb-2 text-lg font-semibold">{quiz.title}</h3>
            {quiz.description && (
              <p className="mb-3 text-sm text-gray-600">{quiz.description}</p>
            )}

            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Passage
                  </td>
                  <td className="py-1.5">{scope}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Corpus
                  </td>
                  <td className="py-1.5">{quiz.corpus}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Search
                  </td>
                  <td className="py-1.5">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                      {quiz.search_template}
                    </code>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Shown
                  </td>
                  <td className="py-1.5">{shown.join(", ") || "none"}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Requested
                  </td>
                  <td className="py-1.5">{requested.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 font-medium text-gray-600">
                    Questions
                  </td>
                  <td className="py-1.5">
                    {questionCount} generated (max {quiz.max_questions})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="w-full rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
