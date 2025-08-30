import React, { useEffect, useState } from "react";
import "./index.css";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://insyd-notification-system-0rnr.onrender.com/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="user-profile">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default UserProfile;
