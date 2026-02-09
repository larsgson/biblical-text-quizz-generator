import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ChatMessage, QuizDefinition } from "../../types/api";
import {
  chatQuiz,
  createQuiz,
  getChatPassword,
  setChatPassword,
} from "../../api/client";
import QuizChat from "./QuizChat";
import QuizPreview from "./QuizPreview";

export default function QuizBuilder() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quizDef, setQuizDef] = useState<QuizDefinition | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(!getChatPassword());
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (password: string) => {
    setChatPassword(password);
    setPasswordError(false);
    setNeedsPassword(false);
  };

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await chatQuiz(text, history);

      // Check if AI built a quiz
      const buildCall = res.tool_calls?.find(
        (tc) => tc.name === "build_quiz",
      );
      if (buildCall) {
        const result = buildCall.result as {
          quiz_definition: QuizDefinition;
          validation: { total_questions_generated: number };
        };
        setQuizDef(result.quiz_definition);
        setQuestionCount(result.validation.total_questions_generated);
      }

      setMessages([
        ...updated,
        { role: "assistant", content: res.reply, toolCalls: res.tool_calls },
      ]);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        setNeedsPassword(true);
        setPasswordError(true);
        sessionStorage.removeItem("chat-password");
      } else {
        setMessages([
          ...updated,
          {
            role: "assistant",
            content: `Error: ${e instanceof Error ? e.message : "Something went wrong"}`,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!quizDef) return;
    setSaving(true);
    try {
      const saved = await createQuiz(quizDef);
      navigate(`/quiz/${saved.id}`);
    } catch (e) {
      alert(
        `Failed to save: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <h1 className="text-lg font-bold">AI Quiz Builder</h1>
        <Link
          to="/quizzes"
          className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
        >
          Back to Quizzes
        </Link>
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className={`border-r border-gray-200 ${quizDef ? "w-1/2" : "w-full"}`}
        >
          <QuizChat
            messages={messages}
            onSend={handleSend}
            loading={loading}
            needsPassword={needsPassword}
            passwordError={passwordError}
            onPasswordSubmit={handlePasswordSubmit}
          />
        </div>
        {quizDef && (
          <div className="w-1/2">
            <QuizPreview
              quiz={quizDef}
              questionCount={questionCount}
              onSave={handleSave}
              saving={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
}
