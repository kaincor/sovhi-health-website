/**
 * Chronic Disease — stage icon for the biological pathway.
 *
 * Exported from design/icons/Chronic Disease.svg and converted rather than linked, so
 * it costs no request and stays crisp at the size the stage cards give it.
 *
 * Figma wrote literal hexes; every one was a palette value and is now the
 * matching CSS variable, so these retune with the palette.
 *
 * Drawn entirely in orange. The heart was rust, which is unreadable on the
 * Sovhi Green well; cream read well but pulled far more attention than the
 * ECG trace beside it, so the whole mark is now one colour and the trace and
 * the heart carry equal weight.
 *
 * width/height are dropped in favour of the viewBox so .pathway__icon can
 * size it; the default preserveAspectRatio keeps it centred and uncropped.
 */
export default function ChronicDisease({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 89 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="An ECG trace running into a heart."
    >
      <path d="M1.5 35C1.5 35 16.5 35.5 17 35C17.5 34.5 23 21.5 23.5 21.5C24 21.5 28.5 47 29 47C29.5 47 34.5 35.5 35 35C35.5 34.5 48 35 48 35" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M65 35H87" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M52.0003 0H56.0003V2.64383C57.2726 2.56635 58.5058 2.64043 59.6139 2.87435C54.9135 4.7244 52.7509 9.4788 52.3968 10.2574L52.375 10.3051C51.2264 10.1307 49.982 9.9857 48.8045 9.9965C47.5911 10.0999 46.4138 10.2792 44.4749 11.3713C44.2015 11.5645 43.8329 11.8814 43.332 12.3646C43.2956 12.3384 43.2566 12.3141 43.2056 12.2822C43.1648 12.2567 43.1161 12.2264 43.0549 12.1864C42.778 12.0055 42.3737 11.7607 41.8807 11.5162C40.8651 11.0123 39.6193 10.5826 38.3984 10.5826V6.7043C40.5095 6.7043 42.4075 7.421 43.7027 8.0636C44.152 8.2865 44.5463 8.5093 44.8726 8.7073C45.1613 8.0911 45.5422 7.518 45.9976 6.9896L43.801 3.54272L47.322 1.25618L49.3485 4.4363C50.1831 4.0059 51.0783 3.64876 52.0003 3.36808V0Z" fill="var(--orange)"/>
      <path d="M62.7567 8.69087C61.299 9.36657 60.0372 10.4773 58.8996 12.6153C58.8996 12.6153 56.3757 11.4611 54.3281 10.8612C55.8996 7.67516 57.7283 5.88257 60.425 4.63257C63.0336 3.4234 66.1456 3.11378 69.8425 3.24153L69.6675 7.99997C66.2564 7.88207 64.3024 7.97437 62.7567 8.69087Z" fill="var(--orange)"/>
      <path d="M45.2812 13.219C38.0186 19.697 48.3937 35.892 56.694 35.892C64.9942 35.892 76.4234 19.7114 68.1068 12.2936C67.9149 12.1224 67.7469 11.9684 67.5909 11.8254C66.9035 11.1951 66.446 10.7757 65.1776 10.0215C62.6253 10.0215 61.0872 12.5746 60.387 14.13C60.3514 14.209 60.3075 14.2827 60.2567 14.3503L58.6425 18.8409L58.0608 20.9291C57.9994 21.1496 58.0154 21.3844 58.1063 21.5945L58.7857 23.1647L62.3037 22.7564L62.5343 24.743L59.2256 25.1271L59.4406 28.2789L57.4453 28.415L57.177 24.4832L56.2708 22.3887C55.9981 21.7585 55.9499 21.0538 56.1341 20.3924L56.1515 20.33L54.1175 21.2498L52.7876 24.6116L50.9278 23.8759L51.9811 21.2135L48.7706 20.4571L49.2292 18.5104L53.2347 19.4541L56.8912 17.8004L58.1208 14.3799C54.9528 12.8915 48.4471 10.3951 45.2812 13.219Z" fill="var(--orange)"/>
    </svg>
  );
}
