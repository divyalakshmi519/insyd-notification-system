import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Posts from "./routes/Posts";
import FollowersList from "./routes/FollowersList";
import FollowingList from "./routes/FollowingList";
import Discover from "./routes/Discover";
import Notifications from "./routes/Notifications";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />

        <Route
          path="/home/*"
          element={
            currentUser ? (
              <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="posts" element={<Posts currentUser={currentUser} />} />
          <Route path="followers" element={<FollowersList currentUser={currentUser} />} />
          <Route path="following" element={<FollowingList currentUser={currentUser} />} />
          <Route path="discover" element={<Discover currentUser={currentUser} />} />
          <Route path="notifications" element={<Notifications currentUser={currentUser} />} />
        </Route>

        <Route path="*" element={<Navigate to={currentUser ? "/home/posts" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
