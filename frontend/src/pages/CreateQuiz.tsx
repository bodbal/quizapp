import { useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Option {
  text: string;
}

interface Question {
  text: string;
  correct_option: number; 
  options: Option[];
}

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", correct_option: 0, options: [] }]);
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "" });
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correct_option = oIndex;
    setQuestions(newQuestions);
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const quizRes = await apiClient.post(
        "/quizzes",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const quizId = quizRes.data.id;

      for (const q of questions) {
        const questionRes = await apiClient.post(
          "/questions",
          {
            quiz_id: quizId,
            text: q.text,
            correct_option: q.correct_option,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const questionId = questionRes.data.id;

        for (const opt of q.options) {
          await apiClient.post(
            "/options",
            { question_id: questionId, text: opt.text },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      toast.success("Quiz létrehozva!");
      navigate("/AllQuize");
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt a quiz létrehozása során!");
    }
  };

  return (
    <div>
      <h2>Új Quiz létrehozása</h2>
      <form onSubmit={handleQuizSubmit}>
        <input
          type="text"
          placeholder="Quiz címe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {questions.map((q, qIndex) => (
          <div key={qIndex} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder={`Kérdés ${qIndex + 1}`}
              value={q.text}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].text = e.target.value;
                setQuestions(newQuestions);
              }}
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correct_option === oIndex}
                  onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                />
                <input
                  type="text"
                  placeholder={`Opció ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[qIndex].options[oIndex].text = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ marginLeft: "5px" }}
                />
              </div>
            ))}
            <button type="button" onClick={() => handleAddOption(qIndex)} style={{ marginTop: "5px" }}>
              Opció hozzáadása
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>
          Kérdés hozzáadása
        </button>
        <button type="submit">Quiz mentése</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
