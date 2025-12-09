import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import type { Quizzes } from "../types/Quizzes";
import "./AllQuize.css";

const AllQuize: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
  const [expanded, setExpanded] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch(() => toast.error("Sikertelen a kvízek betöltése"));
  }, []);

  return (
    <>
      <Navbar expand="lg" className="app-navbar" expanded={expanded}>
        <Container fluid className="navbar-inner px-0">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              <Nav.Link className="nav-link" onClick={() => { navigate("/CreateQuiz"); setExpanded(false); }}>
                Új kvíz
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={() => { navigate("/login"); setExpanded(false); }}>
                Bejelentkezés
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={() => { navigate("/"); setExpanded(false); }}>
                Regisztráció
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={() => { navigate("/AllQuize"); setExpanded(false); }}>
                Kívzek
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
      <Container className="py-4">
        <h2 className="fw-bold mb-4">Összes kvíz</h2>

        <Row className="g-4">
          {quizzes.map((quiz) => (
            <Col md={4} key={quiz.id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{quiz.title}</Card.Title>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/EditQuiz/${quiz.id}`)}
                  >
                    Szerkesztés
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/PlayQuize/${quiz.id}`)}
                  >
                    Megnyitás
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default AllQuize;
