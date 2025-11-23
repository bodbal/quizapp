import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import type { Quizzes } from "../types/Quizzes";

const AllQuize = () => {
  const [quizzes, setQuizzes] = useState<Array<Quizzes>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch(() => toast.error("Sikertelen a kvízek betöltése"));
  }, []);

  return (
    <>
      <h2>Összes Quiz</h2>

      {quizzes.map((quiz) => (
        <div key={quiz.id} style={{ marginBottom: "10px" }}>
          <p>{quiz.title}</p>
          <button onClick={() => navigate(`/PlayQuize/${quiz.id}`)}>
            Megnyitás
          </button>
        </div>
      ))}

      <button onClick={() => navigate("/CreateQuiz")}>Új kvíz</button>
    </>
  );
};

export default AllQuize;
