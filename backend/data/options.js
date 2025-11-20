import db from "./db.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER,
    text TEXT,
    FOREIGN KEY (question_id) REFERENCES questions(id)
  )
`).run();

export const getOptions = () =>
  db.prepare("SELECT * FROM options").all();

export const getOptionsByQuestion = (question_id) =>
  db.prepare("SELECT * FROM options WHERE question_id = ?").all(question_id);

export const getOptionById = (id) =>
  db.prepare("SELECT * FROM options WHERE id = ?").get(id);

export const saveOption = (question_id, text) =>
  db.prepare("INSERT INTO options (question_id, text) VALUES (?, ?)")
    .run(question_id, text);

export const updateOption = (id, question_id, text) =>
  db.prepare(
    "UPDATE options SET question_id = ?, text = ? WHERE id = ?"
  ).run(question_id, text, id);

export const deleteOption = (id) =>
  db.prepare("DELETE FROM options WHERE id = ?").run(id);
