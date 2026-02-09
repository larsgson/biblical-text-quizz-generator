import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../../types/api";

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  loading: boolean;
  needsPassword: boolean;
  passwordError: boolean;
  onPasswordSubmit: (password: string) => void;
}

export default function QuizChat({
  messages,
  onSend,
  loading,
  needsPassword,
  passwordError,
  onPasswordSubmit,
}: Props) {
  const [input, setInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || loading) return;
    onSend(text);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePasswordForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    onPasswordSubmit(passwordInput.trim());
    setPasswordInput("");
  };

  if (needsPassword) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-3 py-2">
          <h2 className="text-sm font-semibold text-gray-700">
            Quiz Builder Assistant
          </h2>
          <p className="text-xs text-gray-400">
            Build quizzes with AI assistance
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <form
            onSubmit={handlePasswordForm}
            className="w-full max-w-xs space-y-3"
          >
            <p className="text-center text-sm text-gray-600">
              Enter password to use the quiz builder.
            </p>
            {passwordError && (
              <p className="text-center text-sm text-red-600">
                Incorrect password. Try again.
              </p>
            )}
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-gray-700">
          Quiz Builder Assistant
        </h2>
        <p className="text-xs text-gray-400">
          Build quizzes with AI assistance
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Describe the quiz you want. For example:</p>
            <p className="mt-1 italic">
              "Create a quiz on qal perfect verbs in Genesis 1, showing the
              gloss and asking for stem and tense"
            </p>
            <p className="italic">
              "Make a 15-question quiz on hiphil verbs in Deuteronomy 6"
            </p>
            <p className="italic">
              "Build a quiz asking for part of speech in Psalm 23"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your quiz..."
            rows={1}
            className="flex-1 resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
