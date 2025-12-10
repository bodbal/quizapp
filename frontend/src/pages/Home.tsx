import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import type { Quizzes } from "../types/Quizzes";
import "./AllQuize.css";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); 
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting registration...");

    try {
      const response = await apiClient.post("/users/register", {
        name,
        email,
        password,
      });

      console.log("Backend response:", response.data);

      toast.success("Sikeres regisztráció!");
      setName("");
      setEmail("");
      setPassword("");

      navigate("/AllQuize");
    } catch (error: any) {
      console.log("Axios error:", error);
      toast.error("Hiba történt a regisztráció során!");
    }
  };

  return (
    <> <Navbar expand="lg" className="app-navbar" expanded={expanded}>
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
    <div>
      <form onSubmit={handleRegister}>
        <h2>Regisztráció</h2>

        <input
          type="text"
          placeholder="Név..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Jelszó..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Sign Up 
        </button>
        <button type="submit" onClick={() => navigate("/Login")}>
          Log In
        </button>
      </form>
    </div>
    </>
  );
};

export default Home;
