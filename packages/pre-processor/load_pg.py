import psycopg2
import psycopg2.extras
import io

connection = psycopg2.connect("postgresql://clqe8tiog000q9ymm9a8xbsdt:RlABIUME7IQVgZWv1oPibcYL@135.181.94.71:9000/clqe8tioh000s9ymm1tiw8tlw")
connection.autocommit = True

with connection.cursor() as cursor:
    csv_file_like_object = io.StringIO()
    with open("../../wiki.txt") as txt_file:
        psycopg2.extras.execute_values(cursor, """
            INSERT INTO words VALUES %s;
        """, ((
            idx,
            line.replace("\n",""),
            len(line.replace("\n", ""))
        )for idx, line in enumerate(txt_file)), page_size=65555)