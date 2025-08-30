import React, { useEffect, useState } from "react";

function Notifications({ currentUser }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    fetch(`https://insyd-notification-system-0rnr.onrender.com/api/notifications/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Notifications fetched:", data);
        setNotifications(data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [currentUser]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.length === 0 ? (
          <li>No notifications yet</li>
        ) : (
          notifications.map((n) => (
            <li key={n.id}>
              {n.message} <span style={{ fontSize: "12px", color: "gray" }}>
                ({new Date(n.createdAt).toLocaleString()})
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Notifications;
