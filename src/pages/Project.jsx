import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Project() {
  const { id } = useParams();
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4020/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4020/api/tasks/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", status: "pending" });
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (taskId, status) => {
    try {
      await axios.put(
        `http://localhost:4020/api/tasks/${taskId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:4020/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove task locally from UI
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Tasks</h1>
      <form onSubmit={createTask} className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="input border p-2 rounded w-40"
          required
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="input border p-2 rounded w-60"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="input border p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : (
        <ul className="grid gap-4">
          {tasks.map((t) => (
            <li
              key={t._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p>{t.description}</p>
                <p className="text-sm text-gray-500">Status: {t.status}</p>
              </div>
              <div className="space-x-2 flex items-center justify-center">
                <select
                  onChange={(e) => updateTask(t._id, e.target.value)}
                  defaultValue={t.status}
                  className="input border p-1 my-2 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => deleteTask(t._id)}
                  className="btn bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
