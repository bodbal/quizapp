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
  );

};