import { FaPowerOff } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full flex items-center font-bold text-white justify-between bg-green-400 p-4 shadow-md">
      <h1 className="capitalize font-bold px-6 text-green-900">{user}</h1>
      <button
        onClick={logout}
        className="relative group cursor-pointer text-sm"
      >
        <FaPowerOff />
        <span
          className="absolute right-full mr-2 top-1/2 -translate-y-1/2 
                   bg-green-800 text-white text-xs rounded px-2 py-1 
                   opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Logout
        </span>
      </button>
    </div>
  );
}

export default Navbar;
