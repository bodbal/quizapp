import { Router } from "express";
import * as Quizzes from "../data/quizzes.js";
import { auth } from "./userRoute.js";

const router = Router();

router.get("/", (req, res) => {
  const quizzes = Quizzes.getQuizzes();
  res.json(quizzes);
});

router.get("/:id", (req, res) => {
  const quiz = Quizzes.getQuizById(+req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
});

router.post("/", auth, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Missing title" });

  const saved = Quizzes.saveQuiz(title);
  const quiz = Quizzes.getQuizById(saved.lastInsertRowid);
  res.json(quiz);
});

router.put("/:id", auth, (req, res) => {
  const id = +req.params.id;
  let quiz = Quizzes.getQuizById(id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Missing title" });

  Quizzes.updateQuiz(id, title);
  quiz = Quizzes.getQuizById(id);
  res.json(quiz);
});

router.delete("/:id", auth, (req, res) => {
  const quiz = Quizzes.getQuizById(+req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  Quizzes.deleteQuiz(+req.params.id);
  res.json({ message: "Quiz deleted successfully" });
});

export default router;
