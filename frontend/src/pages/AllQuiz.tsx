import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
    <Container className="py-4">
      <h2 className="fw-bold mb-4">Összes Quiz</h2>

      <Row className="g-4">
        {quizzes.map((quiz) => (
          <Col md={4} key={quiz.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{quiz.title}</Card.Title>
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-end">
                <Button variant="primary" onClick={() => navigate(`/PlayQuize/${quiz.id}`)}>
                  Megnyitás
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-end mt-4">
        <Button variant="success" onClick={() => navigate("/CreateQuiz")}>Új kvíz</Button>
      </div>
    </Container>
  );
}

export default AllQuize