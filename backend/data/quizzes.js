import db from "./db.js";

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
  )
`
).run();

export const getQuizzes = () => db.prepare("SELECT * FROM quizzes").all();

export const getQuizById = (id) =>
  db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id);

export const saveQuiz = (title) =>
  db.prepare("INSERT INTO quizzes (title) VALUES (?)").run(title);

export const updateQuiz = (id, title) =>
  db.prepare("UPDATE quizzes SET title = ? WHERE id = ?").run(title, id);

export const deleteQuiz = (id) =>
  db.prepare("DELETE FROM quizzes WHERE id = ?").run(id);
