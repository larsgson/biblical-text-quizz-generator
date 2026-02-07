import { Link } from 'react-router-dom';
import type { QuizSession } from '../../types/api';
import { QUIZ_FEATURE_OPTIONS } from '../../types/api';

interface Answer {
  questionIndex: number;
  answers: Record<string, string>;
}

interface Props {
  session: QuizSession;
  answers: Answer[];
  quizId: string;
}

function featureLabel(name: string): string {
  return QUIZ_FEATURE_OPTIONS.find((f) => f.key === name)?.label ?? name;
}

export default function QuizResults({ session, answers, quizId }: Props) {
  let correct = 0;
  let total = 0;

  const details = session.questions.map((q, i) => {
    const given = answers[i]?.answers ?? {};
    const results: { feature: string; expected: string; actual: string; correct: boolean }[] = [];

    for (const [feature, expected] of Object.entries(q.requested_features)) {
      const actual = given[feature] ?? '';
      const isCorrect = actual.trim().toLowerCase() === expected.trim().toLowerCase();
      results.push({ feature, expected, actual, correct: isCorrect });
      total++;
      if (isCorrect) correct++;
    }

    return { question: q, results };
  });

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-2 text-2xl font-bold">Results</h1>
      <h2 className="mb-4 text-lg text-gray-600">{session.quiz_title}</h2>

      {/* Score summary */}
      <div className="mb-6 rounded border border-gray-200 bg-white p-4 text-center">
        <p className="text-4xl font-bold">
          <span className={pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600'}>
            {pct}%
          </span>
        </p>
        <p className="text-gray-500 mt-1">{correct} of {total} correct</p>
      </div>

      {/* Question-by-question detail */}
      <div className="space-y-3">
        {details.map(({ question: q, results }) => (
          <div
            key={q.index}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{q.word_text}</span>
              <span className="text-xs text-gray-400">
                {q.book} {q.chapter}:{q.verse}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              {results.map((r) => (
                <div key={r.feature} className="flex items-center gap-2">
                  <span className={r.correct ? 'text-green-600' : 'text-red-600'}>
                    {r.correct ? '\u2713' : '\u2717'}
                  </span>
                  <span className="text-gray-500">{featureLabel(r.feature)}:</span>
                  {r.correct ? (
                    <span className="text-green-700">{r.actual}</span>
                  ) : (
                    <>
                      <span className="text-red-600 line-through">{r.actual || '(blank)'}</span>
                      <span className="text-green-700">{r.expected}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/quiz/${quizId}/run`}
          reloadDocument
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Retry
        </Link>
        <Link
          to={`/quiz/${quizId}`}
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          Edit Quiz
        </Link>
        <Link
          to="/quizzes"
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
          All Quizzes
        </Link>
      </div>
    </div>
  );
}
