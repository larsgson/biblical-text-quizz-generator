import { useRef, useState } from "react";
import type { ChatMessage as ChatMessageType } from "../types/api";
import { sendChat, getChatPassword, setChatPassword } from "../api/client";
import ChatMessage from "./ChatMessage";

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(!getChatPassword());
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setChatPassword(passwordInput.trim());
    setPasswordError(false);
    setNeedsPassword(false);
    setPasswordInput("");
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessageType = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChat(text);
      const assistantMessage: ChatMessageType = {
        role: "assistant",
        content: response.reply,
        toolCalls: response.tool_calls,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        setNeedsPassword(true);
        setPasswordError(true);
        sessionStorage.removeItem("chat-password");
      } else {
        const errorMessage: ChatMessageType = {
          role: "assistant",
          content: `Error: ${e instanceof Error ? e.message : "Failed to get response"}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (needsPassword) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-3 py-2">
          <h2 className="text-sm font-semibold text-gray-700">Bible Chat</h2>
          <p className="text-xs text-gray-400">
            Ask questions about biblical texts
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <form
            onSubmit={handlePasswordSubmit}
            className="w-full max-w-xs space-y-3"
          >
            <p className="text-sm text-gray-600 text-center">
              Enter password to use the chat.
            </p>
            {passwordError && (
              <p className="text-sm text-red-600 text-center">
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
        <h2 className="text-sm font-semibold text-gray-700">Bible Chat</h2>
        <p className="text-xs text-gray-400">
          Ask questions about biblical texts
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-8">
            <p>Try asking:</p>
            <p className="mt-1 italic">"What verbs appear in Genesis 1:1?"</p>
            <p className="italic">
              "Find all hiphil imperatives in Deuteronomy"
            </p>
            <p className="italic">
              "What is the clause structure of Psalm 23:1?"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about biblical texts..."
            rows={1}
            className="flex-1 resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
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
