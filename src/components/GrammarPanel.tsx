import { GRAMMAR_FEATURES, type GrammarFeature } from '../types/api';

interface Props {
  enabled: Set<GrammarFeature>;
  onToggle: (feature: GrammarFeature) => void;
}

export default function GrammarPanel({ enabled, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {GRAMMAR_FEATURES.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={enabled.has(key)}
            onChange={() => onToggle(key)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
