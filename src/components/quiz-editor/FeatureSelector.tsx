import type { FeatureConfig, FeatureVisibility } from '../../types/api';
import { QUIZ_FEATURE_OPTIONS } from '../../types/api';

interface Props {
  features: FeatureConfig[];
  onChange: (features: FeatureConfig[]) => void;
}

export default function FeatureSelector({ features, onChange }: Props) {
  const getVisibility = (name: string): FeatureVisibility => {
    const found = features.find((f) => f.name === name);
    return found?.visibility ?? 'hide';
  };

  const setVisibility = (name: string, visibility: FeatureVisibility) => {
    const existing = features.filter((f) => f.name !== name);
    if (visibility !== 'hide') {
      existing.push({ name, visibility });
    }
    onChange(existing);
  };

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-1 text-sm">
        <div className="font-semibold text-gray-600">Feature</div>
        <div className="font-semibold text-gray-600 text-center">Show</div>
        <div className="font-semibold text-gray-600 text-center">Request</div>
        <div className="font-semibold text-gray-600 text-center">Hide</div>
        {QUIZ_FEATURE_OPTIONS.map(({ key, label }) => {
          const vis = getVisibility(key);
          return (
            <div key={key} className="contents">
              <div className="py-0.5">{label}</div>
              {(['show', 'request', 'hide'] as FeatureVisibility[]).map((v) => (
                <div key={v} className="flex items-center justify-center">
                  <input
                    type="radio"
                    name={`feat-${key}`}
                    checked={vis === v}
                    onChange={() => setVisibility(key, v)}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
