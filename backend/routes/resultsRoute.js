import { Router } from "express";
import * as Results from "../data/results.js";
import * as Users from "../data/user.js";
import * as Quizzes from "../data/quizzes.js";
import { auth } from "./userRoute.js";

const router = Router();

router.get("/", auth, (req, res) => {
  res.json(Results.getResults());
});

router.get("/:id", auth, (req, res) => {
  const r = Results.getResultById(+req.params.id);
  if (!r) return res.status(404).json({ message: "Result not found" });
  res.json(r);
});

router.get("/user/:userId", auth, (req, res) => {
  res.json(Results.getResultsByUser(+req.params.userId));
});

router.get("/quiz/:quizId", auth, (req, res) => {
  res.json(Results.getResultsByQuiz(+req.params.quizId));
});

router.post("/", auth, (req, res) => {
  const { user_id, quiz_id, score } = req.body;

  if (!user_id || !quiz_id || score == null)
    return res.status(400).json({ message: "Missing data" });

  const user = Users.getUserById(+user_id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const quiz = Quizzes.getQuizById(+quiz_id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const saved = Results.saveResult(user_id, quiz_id, score);
  res.json(Results.getResultById(saved.lastInsertRowid));
});

router.put("/:id", auth, (req, res) => {
  const id = +req.params.id;
  let r = Results.getResultById(id);
  if (!r) return res.status(404).json({ message: "Result not found" });

  const { user_id, quiz_id, score } = req.body;
  if (!user_id || !quiz_id || score == null)
    return res.status(400).json({ message: "Missing data" });

  Results.updateResult(id, user_id, quiz_id, score);
  res.json(Results.getResultById(id));
});

router.delete("/:id", auth, (req, res) => {
  const r = Results.getResultById(+req.params.id);
  if (!r) return res.status(404).json({ message: "Result not found" });

  Results.deleteResult(+req.params.id);
  res.json({ message: "Result deleted successfully" });
});

export default router;
