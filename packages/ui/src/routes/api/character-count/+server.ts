import postgres from 'postgres';
import { env } from '$env/dynamic/private'

type Row = {
	id: number;
	text: string;
	word_length: number;
};

const sql = postgres(env.POSTGRES_URL)


export async function GET({ url }) {
	return new Response(JSON.stringify(await sql`SELECT * FROM words ORDER BY RANDOM() limit 100;`));
}
