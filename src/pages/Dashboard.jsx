import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [projects, setProjects] = useState([]);
  const { token, logout } = useAuth();

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:4020/api/projects/get", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(res.data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:4020/api/projects/post",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Your Projects</h1>
        <button onClick={logout} className="btn bg-red-500">
          Logout
        </button>
      </div>
      <form onSubmit={createProject} className="mt-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="input mr-2"
          required
        />
        <button className="btn">Create</button>
      </form>
      <ul className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
        {projects.length > 0 ? (
          projects?.map((p) => (
            <li key={p._id} className="bg-white p-4 rounded shadow">
              <Link to={`/project/${p._id}`} className="text-xl font-semibold">
                {p.title}
              </Link>
            </li>
          ))
        ) : (
          <h1>No projects found, Try creating one</h1>
        )}
      </ul>
    </div>
  );
}
