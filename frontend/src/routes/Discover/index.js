import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

function Discover({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchAll = useCallback(() => {
    // Fetch all other users
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data.filter(u => u.id !== currentUser.id) : []));
    
    // Fetch following IDs
    fetch(`http://localhost:5000/api/followers/following/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setFollowing(Array.isArray(data) ? data.map(u => u.id) : []));
  }, [currentUser.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleFollow = (userId) => {
    fetch("http://localhost:5000/api/followers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: currentUser.id, followingId: userId })
    }).then(() => {
      fetchAll(); // refresh both users and following list
    });
  };

  return (
    <div>
      <h3>Discover Users</h3>
      {users.map(u => (
        <div key={u.id} className="user-card">
          {u.username}
          <button onClick={() => toggleFollow(u.id)}>
            {following.includes(u.id) ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Discover;
