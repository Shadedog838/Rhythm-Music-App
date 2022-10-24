// import logo from './logo.svg';
import "./App.css";
import Start from "./Components/Pages/Start";
import Home from "./Components/Pages/Home";
import { ThemeContext, themes } from "./Theme";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthenticated = () => {
    let user = localStorage.getItem("user");
    if (user !== null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuthenticated();
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };
  return (
    <ThemeContext.Provider value={themes.dark}>
      <>
        <Router>
          <Routes>
            <Route exact path="/" element={<Start />} />
            <Route path="/home/search" element={<Home />} />
            <Route path="/home/profile" element={<Home />} />
            <Route
              exact
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
            <Route
              exact
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to="/home" />
                )
              }
            />
            <Route path="/home" element={<Home setAuth={setAuth} />} />

          </Routes>
        </Router>
      </>
    </ThemeContext.Provider>
  );
}

export default App;
