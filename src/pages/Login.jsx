import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, userName } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:4020/api/auth/login", {
      email,
      password,
    });
    login(res.data.token);
    userName(res.data.user.name);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-green-200 p-6 rounded-lg shadow-2xl w-96"
      >
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-center text-green-950 text-sm">
            <span className="text-xs">Don't have an account </span>
            <Link
              to={"/signup"}
              className="text-green-900 font-medium underline"
            >
              Signup
            </Link>
          </h1>
          <button className="btn">Login</button>
        </div>
      </form>
    </div>
  );
}
