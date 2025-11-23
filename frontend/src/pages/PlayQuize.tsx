import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correct_option: number;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

const PlayQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Backendről betölti a quiz-t, kérdéseket és opciókat
  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Quiz adat
      const quizRes = await apiClient.get(`/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizData: Quiz = {
        id: quizRes.data.id,
        title: quizRes.data.title,
        questions: [],
      };

      // 2️⃣ Kérdések lekérése
      const questionsRes = await apiClient.get(`/questions?quiz_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const questions: Question[] = await Promise.all(
        questionsRes.data.map(async (q: any) => {
          // 3️⃣ Opciók lekérése minden kérdéshez
          const optionsRes = await apiClient.get(
            `/options?question_id=${q.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          return {
            ...q,
            options: optionsRes.data,
          };
        })
      );

      quizData.questions = questions;
      setQuiz(quizData);
    } catch (err) {
      console.error("Hiba a quiz betöltésénél:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuiz();
  }, [id]);

  // Opció kiválasztása
  const toggleOption = (optionId: number) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  // Következő kérdés / quiz vége
  const handleNext = () => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    if (selectedOptions.includes(currentQ.correct_option)) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptions([]);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (!quiz) return <p>Quiz nem található.</p>;
  if (!quiz.questions || quiz.questions.length === 0)
    return <p>Nincsenek kérdések a quizhez.</p>;

  // Quiz még nem kezdődött
  if (!started) {
    return (
      <div>
        <h2>{quiz.title}</h2>
        <button onClick={() => setStarted(true)}>Kezdés</button>
      </div>
    );
  }

  // Quiz vége
  if (finished) {
    return (
      <div>
        <h2>{quiz.title}</h2>
        <h3>
          Eredmény: {score} / {quiz.questions.length}
        </h3>
      </div>
    );
  }

  // Jelenlegi kérdés
  const question = quiz.questions[currentIndex];

  return (
    <div>
      <h2>{quiz.title}</h2>
      <h3>
        Kérdés {currentIndex + 1} / {quiz.questions.length}
      </h3>
      <p>{question.text}</p>
      <ul>
        {question.options.map((opt) => (
          <li key={opt.id}>
            <button
              onClick={() => toggleOption(opt.id)}
              style={{
                background: selectedOptions.includes(opt.id)
                  ? "lightgreen"
                  : "white",
              }}
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>
        {currentIndex + 1 === quiz.questions.length ? "Befejezés" : "Tovább"}
      </button>
    </div>
  );
};

export default PlayQuiz;
