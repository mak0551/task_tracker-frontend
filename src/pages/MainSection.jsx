import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust path
import { toast } from "react-toastify";
import Loader from "../components/Loader";

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
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

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
      try {
        setLoad(true);
        const res = await axios.get(
          `https://task-tracker-server-9z60.onrender.com/api/tasks/getbydate/${routeDate}`,
          { headers }
        );
        if (res.data) {
          setTasks(normalizeTasks(res.data));
        } else {
          setTasks(initialTasks);
        }
        setLoad(false);
      } catch (err) {
        setLoad(false);
        console.log(err);
        toast.error(err?.response?.data?.error || "Error fetching tasks");
        setTasks(initialTasks);
      } finally {
        setLoad(false);
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
    try {
      setLoading(true);
      const payload = { date: routeDate, ...tasks };
      await axios.post(
        "https://task-tracker-server-9z60.onrender.com/api/tasks/add",
        payload,
        { headers }
      );
      setLoading(false);
      navigate("/");
      toast.success("Saved successfully!");
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Error saving form:", err);
      return;
    }
  };
  const formattedDate = new Date(routeDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const dayName = new Date(routeDate).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="max-w-4xl mx-auto p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4 text-green-900">
        Date: {formattedDate} ({dayName})
      </h1>

      {load ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-green-200">
                  <th className="border border-r-0 px-4 py-2 text-center">
                    Task
                  </th>
                  <th className="border border-x-0 px-2 sm:px-4 py-2">Done</th>
                  <th className="border border-l-0 px-2 sm:px-4 py-2">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tasks).map((taskName) => {
                  const task = tasks[taskName] || { done: false, comment: "" };
                  return (
                    <tr key={taskName} className="hover:bg-green-200">
                      <td className="border border-r-0 px-4 py-2 capitalize text-center">
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
                      <td className="border border-x-0 px-2 sm:px-4 py-2 text-center">
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
                      <td className="border border-l-0 border-t-0 px-4 py-2 flex items-center">
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
          </div>
          <div className="mt-4 justify-start sm:justify-end flex gap-2">
            <button
              type="submit"
              className="btn flex justify-center items-center gap-2"
            >
              Save {loading && <Loader />}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-green-50 border-2 border-green-900 text-green-900 px-4  text-sm py-2 rounded-md hover:bg-green-100 hover:scale-105 transition-transform duration-200"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MainSection;
