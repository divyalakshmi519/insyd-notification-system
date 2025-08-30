import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./index.css";

function Home({ currentUser, setCurrentUser }) {
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifCount = useCallback(() => {
    fetch(`http://localhost:5000/api/notifications/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setNotifCount(Array.isArray(data) ? data.length : 0))
      .catch(err => console.error(err));
  }, [currentUser.id]);

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifCount]);

  const logout = () => {
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h2 className="logo">Insyd</h2>
        <div className="header-right">
          <span className="username">@{currentUser.username}</span>
          <NavLink to="/home/notifications" className="notif-icon">
            🔔 {notifCount > 0 && <span className="notif-count">{notifCount}</span>}
          </NavLink>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="home-nav">
        <NavLink to="/home/posts">Posts</NavLink>
        <NavLink to="/home/followers">Followers</NavLink>
        <NavLink to="/home/following">Following</NavLink>
        <NavLink to="/home/discover">Discover</NavLink>
      </nav>

      <div className="home-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
