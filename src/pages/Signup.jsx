import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://task-tracker-server-9z60.onrender.com/api/auth/signup",
        form
      );
      setLoading(false);
      toast.success("Signup successful, Please login");
    } catch (err) {
      setLoading(false);
      toast.error(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-green-200 p-6 rounded-lg shadow-2xl w-96"
      >
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="input"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
          />
        ))}
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-center text-green-950 text-sm">
            <span className="text-xs">already have an account </span>
            <Link
              to={"/login"}
              className="text-green-900 font-medium underline"
            >
              Login
            </Link>
          </h1>
          <button className="btn flex justify-center items-center gap-2">
            Signup {loading && <Loader />}
          </button>
        </div>
      </form>
    </div>
  );
}
