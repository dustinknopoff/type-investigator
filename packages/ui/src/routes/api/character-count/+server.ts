import postgres from 'postgres';
import { env } from '$env/dynamic/private'


const sql = postgres(env.POSTGRES_URL)


export async function GET({ url }) {
	const count = parseInt(url.searchParams.get("count") || "100")
	return new Response(JSON.stringify(await sql`SELECT * FROM words ORDER BY RANDOM() limit ${count};`));
}
