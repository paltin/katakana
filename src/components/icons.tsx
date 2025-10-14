type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size?: number): React.SVGProps<SVGSVGElement> {
  return {
    width: size ?? 22,
    height: size ?? 22,
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  } as any;
}

export function IconBarChart({ size, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size)} {...rest}>
      <rect x="3" y="10" width="4" height="10" fill="currentColor" />
      <rect x="10" y="6" width="4" height="14" fill="currentColor" />
      <rect x="17" y="3" width="4" height="17" fill="currentColor" />
    </svg>
  );
}

export function IconFunnel({ size, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size)} {...rest}>
      <path d="M3 5h18l-7 8v5l-4 1v-6L3 5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGear({ size, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size)} {...rest}>
      <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
      <path d="M3 12h3m12 0h3M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  );
}

export function IconShuffle({ size, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size)} {...rest}>
      <path d="M3 7h5l3 4-3 4H3" />
      <path d="M14 7h3l4 4-4 4h-3" />
      <path d="M17 7l4 4M21 11l-4 4" />
    </svg>
  );
}

