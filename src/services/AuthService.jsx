import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Optional for token decoding
import { useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const location = useLocation();
//   console.log(location.pathname);

 
  useEffect(() => {
    const checkValidity = async (token) => {
      try {
        const response = await axios.get("http://localhost:3000/api/validateJWT", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response);

        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setUser({
          name: decodedToken.name,
          email: decodedToken.email,
        });
      } catch (error) { 
        // console.error(error);
        logout();
      }
    }

    const token = localStorage.getItem("token");
    if (token) checkValidity(token);
  
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser({
      name: "",
      email: "",
    });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
