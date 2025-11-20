import db from "./db.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER,
    text TEXT,
    correct_option INTEGER,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  )
`).run();

export const getQuestions = () =>
  db.prepare("SELECT * FROM questions").all();

export const getQuestionsByQuiz = (quiz_id) =>
  db.prepare("SELECT * FROM questions WHERE quiz_id = ?").all(quiz_id);

export const getQuestionById = (id) =>
  db.prepare("SELECT * FROM questions WHERE id = ?").get(id);

export const saveQuestion = (quiz_id, text, correct_option) =>
  db.prepare("INSERT INTO questions (quiz_id, text, correct_option) VALUES (?, ?, ?)")
    .run(quiz_id, text, correct_option);

export const updateQuestion = (id, quiz_id, text, correct_option) =>
  db.prepare(
    "UPDATE questions SET quiz_id = ?, text = ?, correct_option = ? WHERE id = ?"
  ).run(quiz_id, text, correct_option, id);

export const deleteQuestion = (id) =>
  db.prepare("DELETE FROM questions WHERE id = ?").run(id);
