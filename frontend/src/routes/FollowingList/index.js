import React, { useEffect, useState, useCallback } from "react";
import "./index.css";

function FollowingList({ currentUser }) {
  const [following, setFollowing] = useState([]);

  const loadFollowing = useCallback(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/users/${currentUser.id}/following`)
      .then(res => res.json())
      .then(data => setFollowing(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [currentUser]);

  useEffect(() => {
    loadFollowing();
  }, [loadFollowing]);

  const unfollow = (userId) => {
  if (!currentUser?.id || !userId) return;
  fetch("http://localhost:5000/api/followers/unfollow", {
    method: "POST", // POST is safer than DELETE with JSON body
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ followerId: currentUser.id, followingId: userId }),
  })
  .then(() => loadFollowing())
  .catch(err => console.error("Unfollow failed:", err));
};




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
