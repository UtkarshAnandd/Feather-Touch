import { Icon } from "@/components/ui/icon";
import { Container, Section } from "@/components/ui/layout";
import { FAQ } from "@/content/home";

/** V3 FAQ (V3-DESIGN-SOURCE §8.13): native <details>, the first one open. */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading" className="py-72 sm:py-112">
      <Container className="grid gap-y-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-start lg:gap-x-72">
        <h2 id="faq-heading" className="type-h2">
          {FAQ.heading}
        </h2>
        <div>
          {FAQ.items.map((item, i) => (
            <details
              key={item.key}
              open={i === 0}
              className="group border-line border-t-[1.5px] last:border-b-[1.5px]"
            >
              <summary className="type-faq-question flex cursor-pointer list-none items-center justify-between gap-20 py-18 sm:py-22 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="bg-paper-deep grid size-36 flex-none place-items-center rounded-full transition-transform duration-200 group-open:rotate-45">
                  <Icon name="plus" />
                </span>
              </summary>
              <p className="text-ink-soft max-w-[38em] pb-24 sm:pr-56">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
