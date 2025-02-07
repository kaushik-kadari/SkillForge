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
  const [badges, setBadges] = useState([
    { id: 1, count: 5 },
    { id: 2, count: 0 },
    { id: 3, count: 0 },
    { id: 4, count: 0 },
    { id: 5, count: 0 },
    { id: 6, count: 5 },
    { id: 7, count: 0 },
    { id: 8, count: 0 },
    { id: 9, count: 0 },
    { id: 10, count: 0 },
    { id: 11, count: 8 },
    { id: 12, count: 0 },
    { id: 13, count: 0 },
    { id: 14, count: 0 },
    { id: 15, count: 0 },
    { id: 16, count: 0 },
    { id: 17, count: 0 },
    { id: 18, count: 10 },
    { id: 19, count: 0 },
    { id: 20, count: 0 },
    { id: 21, count: 0 },
    { id: 22, count: 0 },
    { id: 23, count: 0 },
    { id: 24, count: 7 },
    { id: 25, count: 0 },
    { id: 26, count: 0 },
    { id: 27, count: 0 },
    { id: 28, count: 0 },
    { id: 29, count: 0 },
  ]);


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

        // console.log(isAuthenticated);

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

    if(isAuthenticated && !token) logout();
  
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

  const addBadge = (id) => {
    // console.log(id);
    setBadges((prevBadges) =>
      prevBadges.map((badge) =>
        badge.id === id ? { ...badge, count: badge.count + 1 } : badge
      )
    );
    // setBadges(badges.map((badge) => badge.id == id ? { id, count: badge.count + 1 } : badge));
    // console.log(badges);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, logout, badges, addBadge }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
