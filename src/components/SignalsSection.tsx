import Image from "next/image";

/**
 * "Health doesn't start with a diagnosis" — the six signals Sovhi reads.
 *
 * No motion yet, by request, so this stays a server component. Note that the
 * other three sections animate in on scroll; this one appears as-is.
 *
 * Copy is verbatim from Figma. The ampersands are written as plain text: the
 * unicode-range in globals.css routes U+0026 to Graphik automatically, which
 * is what Figma is doing by hand when it splits those runs into their own
 * spans.
 */
type SignalCard = {
  id: string;
  title: string;
  body: string;
  /** "Environment" is one long word; Figma widens its box and shifts it left. */
  wideTitle?: boolean;
};

const CARDS: readonly SignalCard[] = [
  {
    id: "stress",
    title: "Stress & Resilience",
    body: "How you respond to pressure",
  },
  {
    id: "sleep",
    title: "Sleep & Recovery",
    body: "The time your body has to reset",
  },
  {
    id: "digital",
    title: "Digital Balance",
    body: "Your relationship with technology",
  },
  {
    id: "purpose",
    title: "Purpose & Wellbeing",
    body: "How life feels from the inside",
  },
  {
    id: "environment",
    title: "Environment",
    body: "The world around you",
    wideTitle: true,
  },
];

export default function SignalsSection() {
  return (
    <div className="signals-shell">
      <section
        className="signals bleed-bg"
        aria-labelledby="signals-title"
        id="who-its-for-signals"
      >
        <h2 id="signals-title" className="signals__title">
          Health doesn&rsquo;t start with a diagnosis
        </h2>

        <article className="signals__feature">
          <div className="signals__feature-copy">
            <h3 className="signals__feature-title">Connection</h3>
            <p className="signals__feature-body">
              The strength of your relationships, sense of belonging, and social
              support can shape resilience and long term health.
            </p>
          </div>
          <div className="signals__photo">
            <Image
              src="/images/making-music.jpg"
              alt="Two people playing music together on a patterned rug, one lying down with a guitar and the other sitting on a beanbag with a tambourine."
              width={461}
              height={346}
            />
          </div>
        </article>

        <ul className="signals__cards">
          {CARDS.map((card) => (
            <li
              key={card.id}
              className={`signals__card signals__card--${card.id}`}
            >
              <h3
                className={
                  card.wideTitle
                    ? "signals__card-title signals__card-title--wide"
                    : "signals__card-title"
                }
              >
                {card.title}
              </h3>
              <p className="signals__card-body">{card.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
