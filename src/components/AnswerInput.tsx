import React, { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontRem: number;
  autoFocus?: boolean;
  readOnly?: boolean;
};

export function AnswerInput({ value, onChange, fontRem, autoFocus, readOnly }: Props) {
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
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const ceRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep contentEditable in sync when we render it
  useEffect(() => {
    if (!isAndroid || readOnly) return;
    const el = ceRef.current; if (!el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value, isAndroid, readOnly]);
  // Refocus after advance when autoFocus is true (to keep keyboard open)
  useEffect(() => {
    if (!autoFocus || readOnly) return;
    const t = setTimeout(() => {
      if (isAndroid) ceRef.current?.focus(); else inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [autoFocus, readOnly, isAndroid]);
  return (
    <div className="mt-4 flex justify-center">
      {isAndroid && !readOnly ? (
        <div
          ref={ceRef}
          role="textbox"
          aria-label="Answer"
          contentEditable
          suppressContentEditableWarning
          className="rounded-md border border-neutral-800 bg-neutral-900 leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700 outline-none"
          style={style}
          autoCorrect="off"
          spellCheck={false}
          autoCapitalize="none"
          // @ts-expect-error - not in TS DOM yet in all libs
          inputMode={'latin'}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
          onInput={(e) => {
            const t = e.currentTarget as HTMLDivElement;
            const v = (t.textContent ?? '').trimStart();
            onChange({ target: { value: v } } as any);
          }}
        />
      ) : (
        <input
        ref={inputRef}
        type="text"
        aria-label="Answer"
        className="rounded-md border border-neutral-800 bg-neutral-900 leading-tight text-neutral-400 [font-family:Tahoma] focus:outline-none focus:ring-2 focus:ring-neutral-700"
        style={style}
        autoFocus={!!autoFocus}
        readOnly={!!readOnly}
        // Suppress Chrome/Gboard autofill suggestion bar on Android
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoCapitalize="none"
        inputMode={(readOnly ? 'none' : 'latin') as any}
        name="trainer-input"
        enterKeyHint="done"
        value={value}
        onChange={onChange}
        />
      )}
    </div>
  );
}

