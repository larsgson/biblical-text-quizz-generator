import { useState, useEffect } from "react";
import QuizRunner from "./QuizRunner";

export default function QuizRunnerPage() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // URL pattern: /quiz/<id>/run
    const match = window.location.pathname.match(/^\/quiz\/([^/]+)\/run$/);
    if (match) setId(match[1]);
  }, []);

  if (!id) return <div className="mx-auto max-w-3xl p-4 text-gray-500">Loading...</div>;
  return <QuizRunner id={id} />;
}
