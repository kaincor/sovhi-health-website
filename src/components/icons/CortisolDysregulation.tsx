/**
 * Cortisol Dysregulation — stage icon for the biological pathway.
 *
 * Exported from design/icons/Cortisol Dysregulation.svg and converted rather than linked, so
 * it costs no request and stays crisp at the size the stage cards give it.
 *
 * Figma wrote literal hexes; every one was a palette value and is now the
 * matching CSS variable, so these retune with the palette.
 *
 * The four atom circles are intentionally unfilled: they read as rings on
 * the green well, and the HO / O / O glyphs inside them are separate cream
 * paths that stand on their own. (Figma left these circles with no fill at
 * all, which browsers paint black — that was a default, not a decision.)
 *
 * width/height are dropped in favour of the viewBox so .pathway__icon can
 * size it; the default preserveAspectRatio keeps it centred and uncropped.
 */
export default function CortisolDysregulation({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 58 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The cortisol molecule drawn as four bonded atoms with a hydroxyl group."
    >
      <line y1="-0.5" x2="9.94988" y2="-0.5" transform="matrix(-0.710669 -0.703527 0.710669 -0.703527 41.0713 26)" stroke="var(--cream)" fill="none"/>
      <line y1="-0.5" x2="9.94988" y2="-0.5" transform="matrix(-0.710669 0.703527 -0.710669 -0.703527 23.0713 19)" stroke="var(--cream)" fill="none"/>
      <line y1="-0.5" x2="9.94846" y2="-0.5" transform="matrix(-0.71077 0.703424 0.71077 0.703424 41.0713 40)" stroke="var(--cream)" fill="none"/>
      <line y1="-0.5" x2="9.94846" y2="-0.5" transform="matrix(-0.71077 -0.703424 -0.71077 0.703424 23.0713 46.998)" stroke="var(--cream)" fill="none"/>
      <circle cx="29" cy="11" r="9.5" stroke="var(--orange)" strokeWidth="3" fill="none"/>
      <path d="M26.96 10.488V8.4H28.32V14H26.96V11.784H24.88V14H23.52V8.4H24.88V10.488H26.96ZM31.9238 14.112C30.3638 14.112 29.1077 12.808 29.1077 11.2C29.1077 9.592 30.3638 8.288 31.9238 8.288C33.4758 8.288 34.7398 9.592 34.7398 11.2C34.7398 12.808 33.4758 14.112 31.9238 14.112ZM31.9238 12.832C32.7078 12.832 33.3798 12.16 33.3798 11.2C33.3798 10.24 32.7078 9.568 31.9238 9.568C31.1318 9.568 30.4678 10.24 30.4678 11.2C30.4678 12.16 31.1318 12.832 31.9238 12.832Z" fill="var(--cream)"/>
      <circle cx="11" cy="33" r="9.5" stroke="var(--orange)" strokeWidth="3" fill="none"/>
      <path d="M11.0019 36.112C9.44188 36.112 8.18587 34.808 8.18587 33.2C8.18587 31.592 9.44188 30.288 11.0019 30.288C12.5539 30.288 13.8179 31.592 13.8179 33.2C13.8179 34.808 12.5539 36.112 11.0019 36.112ZM11.0019 34.832C11.7859 34.832 12.4579 34.16 12.4579 33.2C12.4579 32.24 11.7859 31.568 11.0019 31.568C10.2099 31.568 9.54588 32.24 9.54588 33.2C9.54588 34.16 10.2099 34.832 11.0019 34.832Z" fill="var(--cream)"/>
      <circle cx="29" cy="53" r="9.5" stroke="var(--orange)" strokeWidth="3" fill="none"/>
      <circle cx="47" cy="33" r="9.5" stroke="var(--orange)" strokeWidth="3" fill="none"/>
      <path d="M47.0019 36.112C45.4419 36.112 44.1859 34.808 44.1859 33.2C44.1859 31.592 45.4419 30.288 47.0019 30.288C48.5539 30.288 49.8179 31.592 49.8179 33.2C49.8179 34.808 48.5539 36.112 47.0019 36.112ZM47.0019 34.832C47.7859 34.832 48.4579 34.16 48.4579 33.2C48.4579 32.24 47.7859 31.568 47.0019 31.568C46.2099 31.568 45.5459 32.24 45.5459 33.2C45.5459 34.16 46.2099 34.832 47.0019 34.832Z" fill="var(--cream)"/>
    </svg>
  );
}
