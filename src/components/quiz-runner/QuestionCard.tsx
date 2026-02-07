import type { QuizQuestion } from '../../types/api';
import { QUIZ_FEATURE_OPTIONS } from '../../types/api';

interface Props {
  question: QuizQuestion;
  answer: Record<string, string>;
  onAnswer: (feature: string, value: string) => void;
}

/** Known enum values for features — used for dropdown answers. */
const FEATURE_VALUES: Record<string, string[]> = {
  part_of_speech: ['verb', 'subs', 'prep', 'adjv', 'advb', 'conj', 'art', 'prps', 'prde', 'prin', 'intj', 'nega', 'inrg', 'nmpr'],
  gender: ['m', 'f'],
  number: ['sg', 'pl', 'du'],
  person: ['p1', 'p2', 'p3'],
  state: ['a', 'c', 'e'],
  verbal_stem: ['qal', 'nif', 'piel', 'pual', 'hif', 'hof', 'hit'],
  verbal_tense: ['perf', 'impf', 'wayq', 'impv', 'infa', 'infc', 'ptca', 'ptcp'],
};

function featureLabel(name: string): string {
  return QUIZ_FEATURE_OPTIONS.find((f) => f.key === name)?.label ?? name;
}

export default function QuestionCard({ question, answer, onAnswer }: Props) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      {/* Word being quizzed */}
      <div className="mb-4 text-center">
        <p className="text-xs text-gray-400 mb-1">
          {question.book} {question.chapter}:{question.verse}
        </p>
        <p className="text-3xl font-medium">{question.word_text}</p>
        {question.word_text_utf8 && question.word_text_utf8 !== question.word_text && (
          <p className="text-sm text-gray-500 mt-1">{question.word_text_utf8}</p>
        )}
      </div>

      {/* Shown features (context) */}
      {Object.keys(question.shown_features).length > 0 && (
        <div className="mb-4 rounded bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Context</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(question.shown_features).map(([k, v]) => (
              <span key={k}>
                <span className="text-gray-500">{featureLabel(k)}:</span>{' '}
                <span className="font-medium">{v}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Requested features (answers) */}
      <div className="space-y-3">
        {Object.keys(question.requested_features).map((feature) => {
          const values = FEATURE_VALUES[feature];
          return (
            <div key={feature}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {featureLabel(feature)}
              </label>
              {values ? (
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => (
                    <label key={v} className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name={`q${question.index}-${feature}`}
                        checked={answer[feature] === v}
                        onChange={() => onAnswer(feature, v)}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answer[feature] ?? ''}
                  onChange={(e) => onAnswer(feature, e.target.value)}
                  placeholder={`Enter ${featureLabel(feature).toLowerCase()}`}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
