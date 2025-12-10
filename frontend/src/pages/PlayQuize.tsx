import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Container, Navbar, Nav } from "react-bootstrap";
import "./AllQuize.css";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correct_option: number; // opció ID-ja
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Quiz adatainak lekérése
      const quizRes = await apiClient.get(`/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizData: Quiz = {
        id: quizRes.data.id,
        title: quizRes.data.title,
        questions: [],
      };

      // 2. Csak a kiválasztott quiz kérdései
      const questionsRes = await apiClient.get(`/questions?quiz_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const questions: Question[] = await Promise.all(
        questionsRes.data.map(async (q: any) => {
          // Csak az adott kérdés opciói
          const optionsRes = await apiClient.get(`/options?question_id=${q.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            ...q,
            options: optionsRes.data,
            correct_option: q.correct_option, // backend már ID-t ad
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

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!quiz || selectedOption === null) return;

    const currentQ = quiz.questions[currentIndex];
    if (selectedOption === currentQ.correct_option) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <p>Betöltés...</p>;
  if (!quiz) return <p>Quiz nem található.</p>;
  if (!quiz.questions || quiz.questions.length === 0)
    return <p>Nincsenek kérdések a quizhez.</p>;

  if (!started) {
    return (
      <div>
        <h2>{quiz.title}</h2>
        <button onClick={() => setStarted(true)}>Kezdés</button>
      </div>
    );
  }

  if (finished) {
    return (
      <>
        <Navbar expand="lg" className="app-navbar" expanded={expanded}>
          <Container fluid className="navbar-inner px-0">
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto d-flex align-items-center gap-3">
                <Nav.Link
                  onClick={() => {
                    navigate("/CreateQuiz");
                    setExpanded(false);
                  }}
                >
                  Új kvíz
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/login");
                    setExpanded(false);
                  }}
                >
                  Bejelentkezés
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/");
                    setExpanded(false);
                  }}
                >
                  Regisztráció
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div>
          <h2>{quiz.title}</h2>
          <h3>
            Eredmény: {score} / {quiz.questions.length}
          </h3>
        </div>
      </>
    );
  }

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
              onClick={() => handleOptionSelect(opt.id)}
              style={{
                background: selectedOption === opt.id ? "lightgreen" : "white",
              }}
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={selectedOption === null}
      >
        {currentIndex + 1 === quiz.questions.length ? "Befejezés" : "Tovább"}
      </button>
    </div>
  );
};

export default PlayQuiz;
