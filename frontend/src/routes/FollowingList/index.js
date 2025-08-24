import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

function FollowingList({ currentUser }) {
  const [following, setFollowing] = useState([]);

  const fetchFollowing = useCallback(() => {
    fetch(`http://localhost:5000/api/followers/following/${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array of user objects
        setFollowing(Array.isArray(data) ? data : []);
      });
  }, [currentUser.id]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  return (
    <div>
      <h3>Following</h3>
      {following.length === 0 ? (
        <p>You are not following anyone yet.</p>
      ) : (
        following.map(u => (
          <div key={u.id} className="user-card">
            {u.username}
          </div>
        ))
      )}
    </div>
  );
}

export default FollowingList;
