import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizSummary } from '../../types/api';
import { fetchQuizzes, deleteQuiz, createQuiz } from '../../api/client';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchQuizzes()
      .then(setQuizzes)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    const quiz = await createQuiz({ title: 'New Quiz' });
    window.location.href = `/quiz/${quiz.id}`;
  };

  const handleDelete = async (id: string) => {
    await deleteQuiz(id);
    load();
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <div className="flex gap-2">
          <Link to="/" className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">
            Text Display
          </Link>
          <button
            onClick={handleCreate}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            New Quiz
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && quizzes.length === 0 && (
        <p className="text-gray-400 italic">No quizzes yet. Create one to get started.</p>
      )}

      <div className="space-y-2">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
          >
            <div>
              <Link
                to={`/quiz/${q.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {q.title}
              </Link>
              <p className="text-sm text-gray-500">
                {q.corpus} &middot; {q.book}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/quiz/${q.id}/run`}
                className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
              >
                Run
              </Link>
              <button
                onClick={() => handleDelete(q.id)}
                className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
