import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

function FollowersList({ currentUser }) {
  const [followers, setFollowers] = useState([]);

  const fetchFollowers = useCallback(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/users/${currentUser.id}/followers`)
    .then(res => res.json())
    .then(data => setFollowers(Array.isArray(data) ? data : []))
    .catch(err => console.error("Error fetching followers:", err));
  }, [currentUser]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return (
    <div>
      <h3>Followers</h3>
      {followers.length === 0 ? (
        <p>No one is following you yet.</p>
      ) : (
        followers.map(u => (
          <div key={u.id} className="user-card">{u.username}</div>
        ))
      )}
    </div>
  );
}

export default FollowersList;
