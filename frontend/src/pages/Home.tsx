import { useState } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
  );
};

export default Home;
