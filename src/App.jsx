import React from "react";
import Navbar from "./components/Navbar";
import MainSection from "./pages/MainSection";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <div className="bg-green-100 w-full min-h-screen">
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <CalendarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/:date"
                element={
                  <PrivateRoute>
                    <MainSection />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>{" "}
          <ToastContainer position="top-center" autoClose={1500} />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
