/**
 * Downward arrow, exported from Figma as SVG (design/icons/Downwards-Arrow.svg).
 * Dev Mode's flattened version was broken — a stem plus one stray 45deg bar —
 * so this comes from a real SVG export.
 *
 * fill is currentColor so the arrow inherits its parent's colour instead of
 * hard-coding Sovhi Green.
 */
export default function DownArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="7.22412" width="5" height="20" rx="2.5" fill="currentColor" />
      <rect
        x="16.1931"
        y="7.70874"
        width="5"
        height="14"
        rx="2.5"
        transform="rotate(45 16.1931 7.70874)"
        fill="currentColor"
      />
      <rect
        y="11.3115"
        width="5"
        height="14.0032"
        rx="2.5"
        transform="rotate(-45 0 11.3115)"
        fill="currentColor"
      />
    </svg>
  );
}
