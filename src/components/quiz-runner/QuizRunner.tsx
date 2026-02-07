import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { QuizSession } from "../../types/api";
import { generateQuizSession } from "../../api/client";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";

interface Answer {
  questionIndex: number;
  answers: Record<string, string>;
}

export default function QuizRunner() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    generateQuizSession(id)
      .then((s) => {
        setSession(s);
        setAnswers(
          s.questions.map((q) => ({
            questionIndex: q.index,
            answers: Object.fromEntries(
              Object.keys(q.requested_features).map((k) => [k, ""]),
            ),
          })),
        );
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load quiz"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-4 text-gray-500">Loading quiz...</div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="text-red-600">{error || "Quiz not found"}</p>
        <Link to="/quizzes" className="text-blue-600 hover:underline text-sm">
          Back to quizzes
        </Link>
      </div>
    );
  }

  if (session.questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <p className="text-gray-500">
          No questions were generated for this quiz.
        </p>
        <Link
          to={`/quiz/${id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit quiz
        </Link>
      </div>
    );
  }

  if (finished) {
    return <QuizResults session={session} answers={answers} quizId={id!} />;
  }

  const question = session.questions[currentIndex];
  const answer = answers[currentIndex];

  const handleAnswer = (feature: string, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        answers: { ...next[currentIndex].answers, [feature]: value },
      };
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{session.quiz_title}</h1>
        <Link
          to="/quizzes"
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Quit
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>
            Question {currentIndex + 1} of {session.questions.length}
          </span>
          <span>
            {Math.round(((currentIndex + 1) / session.questions.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((currentIndex + 1) / session.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <QuestionCard
        question={question}
        answer={answer.answers}
        onAnswer={handleAnswer}
      />

      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {currentIndex === session.questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
