import React from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontRem: number;
  autoFocus?: boolean;
};

export function AnswerInput({ value, onChange, fontRem, autoFocus }: Props) {
  const MAX_CHAR_REM = 3.8;
  const scale = Math.min(fontRem, MAX_CHAR_REM) / MAX_CHAR_REM;
  const base = {
    widthRem: 10.5,
    fontRem: 1.6,
    padRem: 0.75,
  };
  const style: React.CSSProperties = {
    width: `${base.widthRem * scale}rem`,
    fontSize: `${base.fontRem * scale}rem`,
    paddingTop: `${base.padRem * scale}rem`,
    paddingBottom: `${base.padRem * scale}rem`,
    paddingLeft: `${base.padRem * scale}rem`,
    paddingRight: `${base.padRem * scale}rem`,
  };
  return (
    <div className="mt-4 flex justify-center">
      <input
        type="text"
        aria-label="Answer"
        className="rounded-md border border-neutral-800 bg-neutral-900 leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700"
        style={style}
        autoFocus={!!autoFocus}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

