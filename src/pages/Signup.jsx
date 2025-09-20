import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(form);
      const res = await axios.post(
        "http://localhost:4020/api/auth/signup",
        form
      );
      console.log(res.data);
    } catch (err) {
      return alert("❌ Signup Failed: " + err.message);
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
          <button className="btn">Signup</button>
        </div>
      </form>
    </div>
  );
}
