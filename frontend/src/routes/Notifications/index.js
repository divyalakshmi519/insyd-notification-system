import React, { useState, useEffect, useCallback } from "react";

function Notifications({ currentUser }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifs = useCallback(() => {
    fetch(`http://localhost:5000/api/notifications/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setNotifications(Array.isArray(data) ? data : []));
  }, [currentUser.id]);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.map(n => (
        <div key={n.id} className="notif-card">{n.message}</div>
      ))}
    </div>
  );
}

export default Notifications;
