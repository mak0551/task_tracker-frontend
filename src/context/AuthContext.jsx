import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (tkn) => {
    localStorage.setItem("token", tkn);
    setToken(tkn);
  };
  const userName = (user) => {
    localStorage.setItem("user", user);
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, userName, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
