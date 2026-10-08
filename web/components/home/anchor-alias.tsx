/**
 * Zero-size anchor so legacy Eleventy/Phase 1A fragment links (#daycare,
 * #activities, …) still land on the matching V3 section.
 */
export function AnchorAlias({ ids }: { ids: readonly string[] }) {
  return (
    <>
      {ids.map((id) => (
        <span key={id} id={id} aria-hidden="true" className="block h-0 scroll-mt-0" />
      ))}
    </>
  );
}
