import psycopg2
import psycopg2.extras
import io
import os

connection = psycopg2.connect(os.environ["POSTGRES_URL"])
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