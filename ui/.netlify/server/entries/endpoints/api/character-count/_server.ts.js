import postgres from "postgres";
import { d as private_env } from "../../../../chunks/shared-server.js";
const sql = postgres(private_env.POSTGRES_URL);
async function GET({ url }) {
  const count = parseInt(url.searchParams.get("count") || "100");
  return new Response(JSON.stringify(await sql`SELECT * FROM words ORDER BY RANDOM() limit ${count};`));
}
export {
  GET
};
