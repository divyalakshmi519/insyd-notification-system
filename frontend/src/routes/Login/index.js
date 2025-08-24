// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./index.css";

// function Login({ setCurrentUser }) {
//   const [username, setUsername] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5000/users")
//       .then(res => res.json())
//       .then(data => setUsers(data))
//       .catch(err => console.error(err));
//   }, []);

//   const handleCreateUser = () => {
//     if (!username.trim()) return alert("Enter username");
//     fetch("http://localhost:5000/users", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email: `${username}@mail.com` }),
//     })
//       .then(res => res.json())
//       .then(user => {
//         setCurrentUser(user);
//         localStorage.setItem("currentUser", JSON.stringify(user));
//         navigate("/home/posts");
//       });
//   };

//   const handleLoginExisting = () => {
//     if (!selectedUser) return alert("Select user");
//     const user = users.find(u => u.id === Number(selectedUser));
//     if (!user) return alert("User not found");
//     setCurrentUser(user);
//     localStorage.setItem("currentUser", JSON.stringify(user));
//     navigate("/home/posts");
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>

//       <div className="new-user">
//         <h3>Create New User</h3>
//         <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
//         <button onClick={handleCreateUser}>Create User</button>
//       </div>

//       <div className="divider">OR</div>

//       <div className="existing-user">
//         <h3>Login Existing User</h3>
//         <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
//           <option value="">-- Select User --</option>
//           {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
//         </select>
//         <button onClick={handleLoginExisting}>Login</button>
//       </div>
//     </div>
//   );
// }

// export default Login;

// routes/Login/index.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  // Fetch existing users
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Create new user
  const handleCreateUser = async () => {
    if (!username.trim()) return alert("Enter a username");
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: `${username}@mail.com` }),
      });
      const newUser = await res.json();
      setCurrentUser(newUser);
      navigate("/home/posts", { replace: true }); // replace URL instead of appending
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user");
    }
  };

  // Login existing user
  const handleLoginExisting = () => {
    if (!selectedUser) return alert("Select a user");
    const userObj = users.find((u) => u.id === Number(selectedUser));
    if (!userObj) return alert("User not found");
    setCurrentUser(userObj);
    navigate("/home/posts", { replace: true }); // replace URL
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <div className="new-user">
        <h3>Create New User</h3>
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div className="divider">OR</div>

      <div className="existing-user">
        <h3>Login as Existing User</h3>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
        <button onClick={handleLoginExisting}>Login</button>
      </div>
    </div>
  );
}

export default Login;
