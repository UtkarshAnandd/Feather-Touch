/**
 * Build data — exposes mode and year.
 */
export default function () {
  const mode = process.env.SITE_MODE === "production" ? "production" : "preview";
  return {
    mode,
    year: new Date().getFullYear(),
  };
}
