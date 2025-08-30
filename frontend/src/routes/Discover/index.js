import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./index.css";

function Discover({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);

  const loadData = useCallback(() => {
    if (!currentUser) return;

    Promise.all([
      fetch("https://insyd-notification-system-0rnr.onrender.com/api/users").then(r => r.json()),
      fetch(`https://insyd-notification-system-0rnr.onrender.com/api/users/${currentUser.id}/following`).then(r => r.json())
    ])
    .then(([allUsers, following]) => {
      const others = Array.isArray(allUsers) ? allUsers.filter(u => u.id !== currentUser.id) : [];
      const fIds = Array.isArray(following) ? following.map(u => u.id) : [];
      setUsers(others);
      setFollowingIds(fIds);
    })
    .catch(err => console.error(err));
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const follow = (userId) => {
    if (followingIds.includes(userId)) return;

    fetch("https://insyd-notification-system-0rnr.onrender.com/api/followers/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: currentUser.id, followingId: userId }),
    })
    .then(res => res.json())
    .then(() => loadData())
    .catch(err => console.error("Follow failed:", err));
  };

  const visibleUsers = useMemo(
    () => users.filter(u => !followingIds.includes(u.id)),
    [users, followingIds]
  );

  return (
    <div>
      <h3>Discover Users</h3>
      {visibleUsers.length === 0 ? (
        <p>No new users to discover</p>
      ) : (
        visibleUsers.map(u => (
          <div key={u.id} className="user-card">
            {u.username}
            <button onClick={() => follow(u.id)}>Follow</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Discover;
