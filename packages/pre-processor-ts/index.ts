import { Client } from 'pg'
const client = new Client({
    host: '135.181.94.71',
    port: 9000,
    database: 'clqe8tioh000s9ymm1tiw8tlw',
    user: 'clqe8tiog000q9ymm9a8xbsdt',
    password: 'RlABIUME7IQVgZWv1oPibcYL'
})
await client.connect()



// const migrationClient = postgres("postgresql://clqe8tiog000q9ymm9a8xbsdt:RlABIUME7IQVgZWv1oPibcYL@135.181.94.71:9000/clqe8tioh000s9ymm1tiw8tlw", { max: 1 });

// migrate(drizzle(migrationClient), { migrationsFolder: './drizzle'})

// const queryClient = postgres("postgresql://clqe8tiog000q9ymm9a8xbsdt:RlABIUME7IQVgZWv1oPibcYL@135.181.94.71:9000/clqe8tioh000s9ymm1tiw8tlw");
// const db = drizzle(queryClient);

const wikis = await Bun.file("../../wiki.txt");

const lines = (await wikis.text()).split('\n')

for (let index = 0; index < lines.length; index++) {
    const element = lines[index];
    const query = {
        text: 'INSERT INTO words(text, word_length) VALUES($1, $2);',
        values: [element, element.length],
    }
    await client.query(query)
}

// await pool.end()