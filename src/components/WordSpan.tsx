import { useState } from "react";
import type { GrammarFeature, WordInfo } from "../types/api";
import { GRAMMAR_FEATURES } from "../types/api";

export type DisplayMode = "inline" | "interlinear";

interface Props {
  word: WordInfo;
  enabledFeatures: Set<GrammarFeature>;
  displayMode?: DisplayMode;
  onLexemeClick?: (lexeme: string) => void;
}

export default function WordSpan({
  word,
  enabledFeatures,
  displayMode = "inline",
  onLexemeClick,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);

  const annotations: { label: string; value: string }[] = [];
  for (const { key, label } of GRAMMAR_FEATURES) {
    if (enabledFeatures.has(key)) {
      const val = word[key];
      if (val) annotations.push({ label, value: val });
    }
  }

  if (displayMode === "interlinear") {
    return (
      <span
        className="inline-block cursor-pointer text-center align-top"
        onClick={() => onLexemeClick?.(word.lexeme)}
      >
        <span className="block text-lg hover:text-blue-600">{word.text}</span>
        {annotations.map((a) => (
          <span
            key={a.label}
            className="block border-t border-gray-100 px-1 text-[10px] leading-snug text-gray-500"
            dir="ltr"
          >
            {a.value}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className="group relative inline-block cursor-pointer"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
      onClick={() => onLexemeClick?.(word.lexeme)}
    >
      <span className="text-lg group-hover:text-blue-600">{word.text}</span>
      {annotations.length > 0 && (
        <span className="block text-center text-xs text-gray-500 leading-tight">
          {annotations.map((a) => a.value).join(" ")}
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
