import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4020/api/auth/signup", form);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-2xl mb-4">Signup</h2>
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
          <h1 className="text-center text-sm">
            already have an account{" "}
            <Link to={"/login"} className="text-blue-800 underline">
              Login
            </Link>
          </h1>
          <button className="btn">Signup</button>
        </div>
      </form>
    </div>
  );
}
