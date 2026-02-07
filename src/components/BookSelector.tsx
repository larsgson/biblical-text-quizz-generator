import { useEffect, useState } from 'react';
import type { BookInfo } from '../types/api';
import { fetchBooks } from '../api/client';

interface Props {
  corpus: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  onBookChange: (book: string) => void;
  onChapterChange: (ch: number) => void;
  onVerseStartChange: (v: number) => void;
  onVerseEndChange: (v: number) => void;
}

export default function BookSelector({
  corpus,
  book,
  chapter,
  verseStart,
  verseEnd,
  onBookChange,
  onChapterChange,
  onVerseStartChange,
  onVerseEndChange,
}: Props) {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const selectedBook = books.find((b) => b.name === book);
  const maxChapter = selectedBook?.chapters ?? 1;

  useEffect(() => {
    fetchBooks(corpus).then((b) => {
      setBooks(b);
      if (b.length > 0 && !b.find((bk) => bk.name === book)) {
        onBookChange(b[0].name);
      }
    });
  }, [corpus]);

  const selectClass = 'rounded border border-gray-300 px-2 py-1 text-sm';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={book}
        onChange={(e) => onBookChange(e.target.value)}
        className={selectClass}
      >
        {books.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>

      <label className="text-sm text-gray-600">Ch.</label>
      <input
        type="number"
        min={1}
        max={maxChapter}
        value={chapter}
        onChange={(e) => onChapterChange(Number(e.target.value))}
        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
      />

      <label className="text-sm text-gray-600">Verses</label>
      <input
        type="number"
        min={1}
        value={verseStart}
        onChange={(e) => onVerseStartChange(Number(e.target.value))}
        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <span className="text-gray-400">-</span>
      <input
        type="number"
        min={verseStart}
        value={verseEnd}
        onChange={(e) => onVerseEndChange(Number(e.target.value))}
        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
      />
    </div>
  );
}
