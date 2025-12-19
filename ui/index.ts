import { serve, SQL } from "bun";
import index from "./index.html";
import about from "./about.html";

const db = new SQL(process.env.POSTGRES_URL);

const server = serve({
  routes: {
    "/": index,
    "/about": about,
    "/api/character-count": async (req) => {
      const url = new URL(req.url);
      const count = parseInt(url.searchParams.get("count") || "100");
      return new Response(
        JSON.stringify(
          await db`SELECT * FROM words ORDER BY RANDOM() limit ${count};`,
        ),
      );
    },
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`Listening on ${server.url}`);
