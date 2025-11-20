import express from "express";
import usersRoute from "./routes/userRoute.js";
import postOptions from "./routes/optionsRoute.js";
import postQuiestons from "./routes/questionsRoute.js";
import postQuizzes from "./routes/quizzesRoute.js";
import postResults from "./routes/resultsRoute.js";
const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/users", usersRoute);
app.use("/options", postOptions);
app.use("/questions", postQuiestons);
app.use("/quizzes", postQuizzes);
app.use("/result", postResults);

app.listen(PORT, () => {
  console.log(`Server runs on port http://localhost:${PORT}`);
});
