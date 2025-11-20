import db from "./db.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    quiz_id INTEGER,
    score INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  )
`).run();

export const getResults = () =>
  db.prepare("SELECT * FROM results").all();

export const getResultsByUser = (user_id) =>
  db.prepare("SELECT * FROM results WHERE user_id = ?").all(user_id);

export const getResultsByQuiz = (quiz_id) =>
  db.prepare("SELECT * FROM results WHERE quiz_id = ?").all(quiz_id);

export const getResultById = (id) =>
  db.prepare("SELECT * FROM results WHERE id = ?").get(id);

export const saveResult = (user_id, quiz_id, score) =>
  db.prepare("INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)")
    .run(user_id, quiz_id, score);

export const updateResult = (id, user_id, quiz_id, score) =>
  db.prepare(
    "UPDATE results SET user_id = ?, quiz_id = ?, score = ? WHERE id = ?"
  ).run(user_id, quiz_id, score, id);

export const deleteResult = (id) =>
  db.prepare("DELETE FROM results WHERE id = ?").run(id);
