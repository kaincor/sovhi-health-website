/**
 * Psychosocial Stress — stage icon for the biological pathway.
 *
 * Exported from design/icons/Psychosocial Stress.svg and converted rather than linked, so
 * it costs no request and stays crisp at the size the stage cards give it.
 *
 * Figma wrote literal hexes; every one was a palette value and is now the
 * matching CSS variable, so these retune with the palette. Three colours were
 * changed on purpose — see the conversion note in the pathway CSS: the icons
 * sit in a Sovhi Green well, and green-on-green or rust-on-green vanished.
 *
 * width/height are dropped in favour of the viewBox so .pathway__icon can
 * size it; the default preserveAspectRatio keeps it centred and uncropped.
 */
export default function PsychosocialStress({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 75 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A head in profile with the brain highlighted and stress marks radiating from it."
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8.59668 1.25C5.62816 1.25 3.22168 3.65648 3.22168 6.625V60.375C3.22168 63.3436 5.62816 65.75 8.59668 65.75H18.252V45.6152C12.7985 41.5394 8.59668 36.0485 8.59668 28.9309C8.59668 23.015 11.0654 17.3415 15.46 13.1583C19.8544 8.97513 25.8146 6.62502 32.0293 6.62502C36.7751 6.61989 41.4648 7.60268 45.7695 9.50457C49.162 10.8644 52.1322 13.0286 54.3971 15.7906C56.4654 18.6924 57.6117 22.0998 57.6989 25.6052C57.7177 26.4109 57.7064 27.1749 57.6955 27.9139C57.657 30.5233 57.623 32.8213 58.9345 35.5393C58.9345 35.5393 62.8114 39.0271 62.3003 41.8255C61.7889 44.6239 56.7402 45.3943 56.7402 45.3943C56.7402 60.461 37.5681 54.1726 37.5681 54.1726V65.75H62.3467C65.3153 65.75 67.7217 63.3436 67.7217 60.375V6.625C67.7217 3.65648 65.3153 1.25 62.3467 1.25H8.59668Z" fill="var(--orange)"/>
      <path d="M39.5372 30.7318C40.6913 30.7318 40.3254 30.3932 41.2786 29.7599C42.2462 30.392 43.3884 30.7232 44.5537 30.7102L48.2557 29.3992C49.2988 28.5623 50.0149 27.4022 50.2842 26.1129C50.5533 24.8236 50.3594 23.4837 49.7347 22.3169C49.1101 21.1502 48.0925 20.2277 46.8524 19.7038C46.5694 18.4555 45.8561 17.3391 44.8311 16.5397L41.2177 15.309H40.8108C40.007 14.1679 38.8003 13.3537 37.4202 13.0216L31.1659 12.5977C29.878 12.7019 28.6638 13.2246 27.7183 14.0817C27.2715 13.9792 26.8144 13.9262 26.3554 13.9233C25.244 13.9256 24.157 14.2408 23.2259 14.831C22.2946 15.421 21.5586 16.2609 21.1071 17.249L18.1634 19.2783C17.431 20.2441 17.0366 21.4134 17.0386 22.6136C17.0314 23.1156 17.0998 23.6159 17.2419 24.0984C16.4697 25.0736 16.0544 26.272 16.0621 27.5033C16.0603 28.9312 16.6209 30.3056 17.6286 31.3435C17.7099 32.3658 18.0768 33.3471 18.6901 34.181C19.3032 35.015 20.1391 35.6699 21.1071 36.0748C22.2226 36.7553 23.167 37.6704 23.8711 38.753C24.5752 39.8355 24.8658 41.0579 25.0204 42.3302H31.1659V36.3915C31.1644 35.337 31.4667 34.3034 32.0384 33.4075C32.6101 32.5119 32.9305 31.79 33.9025 31.3238C34.8132 30.9847 35.6336 30.45 36.3028 29.7599C37.2559 30.3932 38.3832 30.7318 39.5372 30.7318Z" fill="var(--teal)"/>
      <path d="M50.402 35.7396C50.402 36.9764 49.3992 37.9792 48.1624 37.9792C46.9255 37.9792 45.9229 36.9764 45.9229 35.7396C45.9229 34.5026 46.9255 33.5 48.1624 33.5C49.3992 33.5 50.402 34.5026 50.402 35.7396Z" fill="var(--teal)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.9927 48.431H25.0205V44.8477H30.9927V48.431Z" fill="var(--teal)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.9927 54.4036H25.0205V50.8203H30.9927V54.4036Z" fill="var(--teal)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.9927 60.3744H25.0205V56.791H30.9927V60.3744Z" fill="var(--teal)"/>
      <path d="M11.4717 1.5L3.47168 10H11.4717L3.47168 18" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M63.4717 10.5L71.4717 19.2576H63.4717L71.4717 27.5" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
