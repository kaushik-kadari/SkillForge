import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { addBadges, getBadges } from "./contentService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
  const [user, setUser] = useState({
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
  });
  const [badges, setBadges] = useState([]);

  const url = import.meta.env.VITE_serverUrl;

  const navigate = useNavigate();
  const location = useLocation();
  //   console.log(location.pathname);

  const fetchBadges = async (email) => {
    // console.log(email);
    await getBadges(email).then((res) => {
      // console.log(res);
      if (res) {
        setBadges(res.badges);
      }
    });
  };

  useEffect(() => {
    // console.log("yes");
    const checkValidity = async (token) => {
      try {
        const response = await axios.get(
          url + "validateJWT",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response);

        // console.log(isAuthenticated);

        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        if (!user.name || !user.email) {
          localStorage.setItem("name", decodedToken.name);
          localStorage.setItem("email", decodedToken.email);
          setUser({
            name: decodedToken.name,
            email: decodedToken.email,
          });
        }
        await fetchBadges(decodedToken.email);
      } catch (error) {
        // console.error(error);
        logout();
      }
    };

    const token = localStorage.getItem("token");
    if (token) checkValidity(token);

    if (isAuthenticated && !token) logout();
  }, [location.pathname]);

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser({
      name: "",
      email: "",
    });
    if(user.email && badges.length > 0) await addBadges(user.email, badges);
    // window.location.href = "/login";
    navigate("/login");
  };

  const addBadge = async (id) => {
    // console.log(id);
    setBadges((prevBadges) => {
      const updatedBadges = prevBadges.map((badge) =>
        badge.id === id ? { ...badge, count: badge.count + 1 } : badge
      );
      // console.log(updatedBadges);
      if (user.email) addBadges(user.email, updatedBadges);
      return updatedBadges;
    });

    // setBadges(badges.map((badge) => badge.id == id ? { id, count: badge.count + 1 } : badge));
    // console.log(badges);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        badges,
        addBadge,
        setBadges,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
