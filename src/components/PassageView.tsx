import type { GrammarFeature, VerseResult } from '../types/api';
import WordSpan from './WordSpan';

interface Props {
  verses: VerseResult[];
  corpus: string;
  enabledFeatures: Set<GrammarFeature>;
}

export default function PassageView({ verses, corpus, enabledFeatures }: Props) {
  if (verses.length === 0) {
    return <p className="text-gray-400 italic">No verses loaded.</p>;
  }

  const isRtl = corpus === 'hebrew';

  return (
    <div className="space-y-3">
      {verses.map((v) => (
        <div key={`${v.book}-${v.chapter}-${v.verse}`} className="flex gap-2">
          <span className="mt-1 shrink-0 text-xs font-semibold text-gray-400">
            {v.chapter}:{v.verse}
          </span>
          <div
            className="flex flex-wrap items-start gap-x-2 gap-y-1"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {v.words.map((w, i) => (
              <WordSpan key={w.monad ?? i} word={w} enabledFeatures={enabledFeatures} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
