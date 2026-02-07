import { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '../types/api';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const [showTools, setShowTools] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-2 border-t border-gray-200 pt-1">
            <button
              onClick={() => setShowTools(!showTools)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showTools ? 'Hide' : 'Show'} {message.toolCalls.length} tool call{message.toolCalls.length > 1 ? 's' : ''}
            </button>
            {showTools && (
              <div className="mt-1 space-y-1">
                {message.toolCalls.map((tc, i) => (
                  <div key={i} className="rounded bg-gray-200 p-2 text-xs font-mono">
                    <div className="font-semibold">{tc.name}({JSON.stringify(tc.input)})</div>
                    <div className="mt-1 max-h-32 overflow-auto text-gray-600">
                      {JSON.stringify(tc.result, null, 2).slice(0, 500)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
