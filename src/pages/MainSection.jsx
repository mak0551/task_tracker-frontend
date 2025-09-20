import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust path

const initialTasks = {
  fajr: { done: false, comment: "" },
  zuhr: { done: false, comment: "" },
  asr: { done: false, comment: "" },
  maghrib: { done: false, comment: "" },
  isha: { done: false, comment: "" },
  tahajjud: { done: false, comment: "" },
  asmaulhusna: { done: false, comment: "" },
  dalailulkhairat: { done: false, comment: "" },
  muraqaba: { done: false, comment: "" },
  tasawwureshaikh: { done: false, comment: "" },
  duroodCount: { done: false, comment: "" },
  other: { comment: "" },
};

function MainSection() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const { date: routeDate } = useParams(); // get date from URL
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);

  // Normalize API response to match initialTasks structure
  const normalizeTasks = (data) => {
    const result = {};
    Object.keys(initialTasks).forEach((key) => {
      if (data[key] && typeof data[key] === "object") {
        result[key] = { ...initialTasks[key], ...data[key] };
      } else {
        // if backend sends boolean or missing field
        result[key] = { ...initialTasks[key], done: !!data[key] };
      }
    });
    return result;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!routeDate) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4020/api/tasks/getbydate/${routeDate}`,
          { headers }
        );
        if (res.data) {
          setTasks(normalizeTasks(res.data));
        } else {
          setTasks(initialTasks);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks(initialTasks);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [routeDate]);

  const handleCheckboxChange = (taskName) => {
    setTasks((prev) => ({
      ...prev,
      [taskName]: {
        ...prev[taskName],
        done: !prev[taskName].done,
      },
    }));
  };

  const handleCommentChange = (taskName, value) => {
    setTasks((prev) => ({
      ...prev,
      [taskName]: { ...prev[taskName], comment: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeDate) return alert("Date is missing!");

    const payload = { date: routeDate, ...tasks };
    try {
      const res = await axios.post(
        "http://localhost:4020/api/tasks/add",
        payload,
        { headers }
      );
      console.log("Tasks saved:", res.data);
      alert("Tasks saved successfully!");
    } catch (err) {
      console.error("Error saving tasks:", err);
      alert("Failed to save tasks");
    }
  };
  const formattedDate = new Date(routeDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4">Date: {formattedDate}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-200">
                <th className="border px-4 py-2 text-left">Task</th>
                <th className="border px-4 py-2">Done</th>
                <th className="border px-4 py-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tasks).map((taskName) => {
                const task = tasks[taskName] || { done: false, comment: "" };
                return (
                  <tr key={taskName} className="hover:bg-green-100">
                    <td className="border px-4 py-2 capitalize text-center">
                      {taskName === "asmaulhusna"
                        ? "Asma-Ul-Husna"
                        : taskName === "dalailulkhairat"
                        ? "Dalail-Ul-Khairat"
                        : taskName === "tasawwureshaikh"
                        ? "Tasawwur-e-Shaikh"
                        : taskName === "duroodCount"
                        ? "Durood Shareef"
                        : taskName}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {"done" in task ? (
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-green-600"
                          checked={task.done}
                          onChange={() => handleCheckboxChange(taskName)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <textarea
                        placeholder="Comment..."
                        value={task.comment}
                        onChange={(e) =>
                          handleCommentChange(taskName, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4">
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MainSection;
