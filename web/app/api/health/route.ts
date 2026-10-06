import { connection } from "next/server";

/** Liveness probe. Deliberately touches no database or secrets. */
export async function GET() {
  await connection();
  return Response.json({ status: "ok" });
}
