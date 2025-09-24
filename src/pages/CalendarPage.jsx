import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const selected = date.toLocaleDateString("sv-SE"); // always YYYY-MM-DD
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    navigate(`/tasks/${selected}?day=${dayName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-200 p-10">
      <h1 className="sm:text-4xl font-bold mb-6 sm:w-fit text-2xl flex items-center gap-2 text-green-900">
        <SlCalender />
        My Calendar
      </h1>
      <Calendar
        onClickDay={handleDateClick}
        className="w-full rounded-lg shadow-xl p-4 bg-white sm:text-lg text-md"
      />
    </div>
  );
}
