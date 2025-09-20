import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const selected = date.toISOString().split("T")[0]; // YYYY-MM-DD
    navigate(`/tasks/${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-200 p-10">
      <h1 className="text-4xl font-bold mb-6">📅 My Calendar</h1>
      <Calendar
        onClickDay={handleDateClick}
        className="rounded-lg shadow-2xl p-4 bg-white"
      />
    </div>
  );
}
