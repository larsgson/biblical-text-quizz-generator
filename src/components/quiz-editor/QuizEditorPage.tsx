import { useState, useEffect } from "react";
import QuizEditor from "./QuizEditor";

export default function QuizEditorPage() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // URL pattern: /quiz/<id>
    const match = window.location.pathname.match(/^\/quiz\/([^/]+)$/);
    if (match) setId(match[1]);
  }, []);

  if (!id) return <div className="mx-auto max-w-3xl p-4 text-gray-500">Loading...</div>;
  return <QuizEditor id={id} />;
}
