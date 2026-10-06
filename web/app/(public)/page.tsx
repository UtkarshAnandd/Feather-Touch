import { PUBLIC_SECTIONS } from "@/content/sections";
import { SITE } from "@/content/site";

/**
 * PHASE 1A skeleton of the public homepage: one landmark per V1 section with
 * the preserved anchor IDs. No V3 visuals and no school facts are rendered.
 */
export default function HomePage() {
  return (
    <>
      <h1>{SITE.name}</h1>
      <p>{SITE.tagline}</p>
      {PUBLIC_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`}>{section.label}</h2>
          <p>Placeholder — implemented to the approved V3 design in a later phase.</p>
        </section>
      ))}
    </>
  );
}
