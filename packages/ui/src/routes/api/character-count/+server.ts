import postgres from 'postgres';

type Row = {
	id: number;
	text: string;
	word_length: number;
};

const sql = postgres('postgresql://clqe8tiog000q9ymm9a8xbsdt:RlABIUME7IQVgZWv1oPibcYL@135.181.94.71:9000/clqe8tioh000s9ymm1tiw8tlw')


export async function GET({ url }) {
	return new Response(JSON.stringify(await sql`SELECT * FROM words ORDER BY RANDOM() limit 20;`));
}
