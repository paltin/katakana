import React from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AnswerInput({ value, onChange }: Props) {
  return (
    <div className="mt-4 flex justify-center">
      <input
        type="text"
        aria-label="Answer"
        className="w-[10.5rem] md:w-48 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-3 text-[1.6rem] leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700"
        autoFocus
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

