import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, userName, token } = useAuth();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://task-tracker-server-9z60.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      toast.success("Login successful");
      login(res.data.token);
      userName(res.data.user.name);
      navigate("/");
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials"
      );
      setLoading(false);
    }
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
          <button className="btn flex justify-center items-center gap-2">
            Login {loading && <Loader />}
          </button>
        </div>
      </form>
    </div>
  );
}
