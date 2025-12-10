import { Router } from "express";
import * as Options from "../data/options.js";
import * as Questions from "../data/questions.js";
import { auth } from "./userRoute.js";

const router = Router();

router.get("/", (req, res) => {
  const questionId = req.query.question_id ? +req.query.question_id : null;
  if (questionId) {
    const options = Options.getOptionsByQuestion(questionId);
    res.json(options);
  } else {
    res.json(Options.getOptions());
  }
});
router.get("/:id", (req, res) => {
  const opt = Options.getOptionById(+req.params.id);
  if (!opt) return res.status(404).json({ message: "Option not found" });
  res.json(opt);
});

router.get("/question/:questionId", (req, res) => {
  res.json(Options.getOptionsByQuestion(+req.params.questionId));
});

router.post("/", auth, (req, res) => {
  const { question_id, text } = req.body;
  if (!question_id || !text)
    return res.status(400).json({ message: "Missing data" });

  const q = Questions.getQuestionById(+question_id);
  if (!q) return res.status(404).json({ message: "Question not found" });

  const saved = Options.saveOption(question_id, text);
  res.json(Options.getOptionById(saved.lastInsertRowid));
});

router.put("/:id", auth, (req, res) => {
  const id = +req.params.id;
  let opt = Options.getOptionById(id);
  if (!opt) return res.status(404).json({ message: "Option not found" });

  const { question_id, text } = req.body;
  if (!question_id || !text)
    return res.status(400).json({ message: "Missing data" });

  Options.updateOption(id, question_id, text);
  res.json(Options.getOptionById(id));
});

router.delete("/:id", auth, (req, res) => {
  const opt = Options.getOptionById(+req.params.id);
  if (!opt) return res.status(404).json({ message: "Option not found" });

  Options.deleteOption(+req.params.id);
  res.json({ message: "Option deleted successfully" });
});

export default router;
