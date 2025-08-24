import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

function FollowersList({ currentUser }) {
  const [followers, setFollowers] = useState([]);

  const fetchFollowers = useCallback(() => {
    fetch(`http://localhost:5000/api/followers/followers/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        setFollowers(Array.isArray(data) ? data : []);
      });
  }, [currentUser.id]);

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
