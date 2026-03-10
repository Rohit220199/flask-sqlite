from flask import Flask, request, jsonify
import psycopg2
import os

app = Flask(__name__)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres-service"),
        database=os.getenv("DB_NAME", "flaskdb"),
        user=os.getenv("DB_USER", "flaskuser"),
        password=os.getenv("DB_PASSWORD", "flaskpass")
    )
    return conn


# Initialize table
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)

    conn.commit()
    cur.close()
    conn.close()


@app.route("/notes", methods=["GET"])
def get_notes():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, title, content FROM notes")
    rows = cur.fetchall()

    notes = []
    for row in rows:
        notes.append({
            "id": row[0],
            "title": row[1],
            "content": row[2]
        })

    cur.close()
    conn.close()

    return jsonify(notes)


@app.route("/notes", methods=["POST"])
def create_note():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO notes (title, content) VALUES (%s, %s)",
        (data["title"], data["content"])
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Note added"}), 201


@app.route("/notes/<int:id>", methods=["DELETE"])
def delete_note(id):

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM notes WHERE id = %s", (id,))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Note deleted"})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000)
