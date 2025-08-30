// import React, { useState, useEffect, useCallback } from "react";

// function Notifications({ currentUser }) {
//   const [notifications, setNotifications] = useState([]);

//   const fetchNotifs = useCallback(() => {
//     fetch(`http://localhost:5000/api/notifications/${currentUser.id}`)
//       .then(res => res.json())
//       .then(data => setNotifications(Array.isArray(data) ? data : []));
//   }, [currentUser.id]);

//   useEffect(() => {
//     fetchNotifs();
//     const interval = setInterval(fetchNotifs, 5000);
//     return () => clearInterval(interval);
//   }, [fetchNotifs]);

//   return (
//     <div>
//       <h3>Notifications</h3>
//       {notifications.map(n => (
//         <div key={n.id} className="notif-card">{n.message}</div>
//       ))}
//     </div>
//   );
// }

// export default Notifications;

import React, { useEffect, useState } from "react";

function Notifications({ currentUser }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/notifications/${currentUser.id}`)
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
