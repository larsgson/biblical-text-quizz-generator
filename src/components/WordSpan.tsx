import { useState } from 'react';
import type { GrammarFeature, WordInfo } from '../types/api';
import { GRAMMAR_FEATURES } from '../types/api';

interface Props {
  word: WordInfo;
  enabledFeatures: Set<GrammarFeature>;
}

export default function WordSpan({ word, enabledFeatures }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  const annotations: string[] = [];
  for (const { key } of GRAMMAR_FEATURES) {
    if (enabledFeatures.has(key)) {
      const val = word[key];
      if (val) annotations.push(val);
    }
  }

  return (
    <span
      className="group relative inline-block cursor-pointer"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <span className="text-lg group-hover:text-blue-600">{word.text}</span>
      {annotations.length > 0 && (
        <span className="block text-center text-xs text-gray-500 leading-tight">
          {annotations.join(' ')}
        </span>
      )}
      <span>{word.trailer}</span>

      {showPopup && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded bg-gray-800 px-3 py-2 text-sm text-white shadow-lg whitespace-nowrap">
          <table className="text-left">
            <tbody>
              {GRAMMAR_FEATURES.map(({ key, label }) => {
                const val = word[key];
                if (!val) return null;
                return (
                  <tr key={key}>
                    <td className="pr-2 text-gray-400">{label}</td>
                    <td>{val}</td>
                  </tr>
                );
              })}
              {word.lexeme_utf8 && (
                <tr>
                  <td className="pr-2 text-gray-400">Lexeme (native)</td>
                  <td>{word.lexeme_utf8}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </span>
  );
}
