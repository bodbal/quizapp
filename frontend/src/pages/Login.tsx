import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import "./AllQuize.css";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
    const [expanded, setExpanded] = useState(false); 
const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiClient.post<string>("/users/login", {
        email,
        password,
      });

      const token = res.data; 

      localStorage.setItem("token", token);

      toast.success("Sikeres bejelentkezés")

      navigate("/AllQuize")
    
    } catch (err) {
      toast.error("Sikertelen a bejelentkezés")
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
      <form onSubmit={handleLogin}>
        <h2>Bejelentkezés</h2>

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
          Log In
        </button>
        <button type="submit" onClick={() => navigate("/")}>
          Sign up
        </button>

      </form>
    </div>
    </>
  );

};