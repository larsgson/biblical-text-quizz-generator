import { useEffect, useState } from 'react';
import type { Corpus } from '../types/api';
import { fetchCorpora } from '../api/client';

interface Props {
  value: string;
  onChange: (corpus: string) => void;
}

export default function CorpusSelector({ value, onChange }: Props) {
  const [corpora, setCorpora] = useState<Corpus[]>([]);

  useEffect(() => {
    fetchCorpora().then(setCorpora);
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-300 px-2 py-1 text-sm"
    >
      {corpora.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
