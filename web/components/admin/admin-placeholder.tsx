/** Phase 1A placeholder for an admin module that is built in a later phase. */
export function AdminPlaceholder({
  title,
  phase,
  purpose,
}: {
  title: string;
  phase: string;
  purpose: string;
}) {
  return (
    <>
      <h1>{title}</h1>
      <p>{purpose}</p>
      <p>
        <strong>Not built yet</strong> — scheduled for {phase}.
      </p>
    </>
  );
}
