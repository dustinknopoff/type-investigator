import sqlite3

conn = sqlite3.connect("words.db")
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS words;")
cursor.execute("CREATE TABLE words(id INT PRIMARY KEY, text TEXT, word_length number);")

with open("wiki.txt") as txt_file:
    for idx, line in enumerate(txt_file):
        cursor.execute("INSERT INTO words(id, text, word_length) VALUES (?,?,?)", (idx, line, len(line.replace("\n","").split(" "))))
        if idx % 50000 == 0:
            conn.commit()
