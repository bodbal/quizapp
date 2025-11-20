import { Router } from "express";
import * as Questions from "../data/questions.js";
import * as Quizzes from "../data/quizzes.js";
import { auth } from "./userRoute.js";

const router = Router();

router.get("/", (req, res) => {
  const questions = Questions.getQuestions();
  res.json(questions);
});


router.get("/:id", (req, res) => {
  const q = Questions.getQuestionById(+req.params.id);
  if (!q) return res.status(404).json({ message: "Question not found" });
  res.json(q);
});


router.get("/quiz/:quizId", (req, res) => {
  const list = Questions.getQuestionsByQuiz(+req.params.quizId);
  res.json(list);
});


router.post("/", auth, (req, res) => {
  const { quiz_id, text, correct_option } = req.body;

  if (!quiz_id || !text || correct_option == null)
    return res.status(400).json({ message: "Missing required data" });

  const quiz = Quizzes.getQuizById(+quiz_id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const saved = Questions.saveQuestion(quiz_id, text, correct_option);
  const question = Questions.getQuestionById(saved.lastInsertRowid);

  res.json(question);
});


router.put("/:id", auth, (req, res) => {
  const id = +req.params.id;
  let q = Questions.getQuestionById(id);
  if (!q) return res.status(404).json({ message: "Question not found" });

  const { quiz_id, text, correct_option } = req.body;
  if (!quiz_id || !text || correct_option == null)
    return res.status(400).json({ message: "Missing required data" });

  Questions.updateQuestion(id, quiz_id, text, correct_option);
  q = Questions.getQuestionById(id);
  res.json(q);
});


router.delete("/:id", auth, (req, res) => {
  const q = Questions.getQuestionById(+req.params.id);
  if (!q) return res.status(404).json({ message: "Question not found" });

  Questions.deleteQuestion(+req.params.id);
  res.json({ message: "Question deleted successfully" });
});

export default router;
