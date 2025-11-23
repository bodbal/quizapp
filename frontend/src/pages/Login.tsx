import { useState } from "react";
import apiClient from "../api/apiClient"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
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
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.box}>
        <h2>Bejelentkezés</h2>

        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Jelszó..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Log In
        </button>
        <button type="submit" onClick={() => navigate("/")}>
          Sign up
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f0f0",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    background: "#fff",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,.1)",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};