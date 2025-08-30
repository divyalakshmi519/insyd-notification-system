# INSYD Notification System – Proof of Concept (POC)

## Overview
The **INSYD Notification System** is a full-stack deployed POC demonstrating how notifications can be triggered and delivered in a social media–like application.  
It integrates **database design, backend APIs, and frontend UI** into a working system, showing how DBMS concepts are applied in real-world applications.

---

## How It Works

### - User Registration & Login
- Users are uniquely identified and stored in the database.  
- Authentication ensures only registered users can access the system.  

### - Creating Posts
- Logged-in users can create posts.  
- Each post is tied to a user and stored with a timestamp.  

### - Generating Notifications
- When another user interacts (**likes, comments, or follows**), a notification entry is automatically created.  
- Notifications are stored in the database with **event details**.  

### - Viewing Notifications
- The frontend displays a **notification icon with count** in the header.  
- Clicking the icon reveals all unread notifications for the user.  

### - Real-time Updates
- Notifications are dynamically updated as soon as a new event occurs, **without page refresh**.  

---

## Tech Stack

- **Database:** SQLite (lightweight for POC, scalable to MySQL/PostgreSQL)  
- **Backend:** Node.js + Express.js REST APIs  
- **Frontend:** React.js with modular components *(Login, Home, Header, Notifications, PostForm)*  
- **Deployment:**  
  - Frontend → [Netlify](https://68b2f4d52fd3df6ff8d14960--insyd-notification-system.netlify.app/login)  
  - Backend → [Render](https://insyd-notification-system-0rnr.onrender.com/api/users)  
- **Version Control:** GitHub → [Repository Link](https://github.com/divyalakshmi519/insyd-notification-system)  

---

## Backend API Endpoints

- **Users:** `/api/users`  
- **Posts:** `/api/posts`  
- **Likes:** `/api/likes`  
- **Followers:** `/api/followers`  
- **Notifications:** `/api/notifications`  

---

## Features

- **Secure Login System**  
- **Post Creation & Management**  
- **Dynamic Notifications with Count Badge**  
- **Notification History View**  
- **Real-time Updates Without Page Reload**  
- **Responsive UI for Seamless Use**  

---

## Getting Started

### - Backend
- Deployment → [Render](https://insyd-notification-system-0rnr.onrender.com/api/users)  
- Ensure **CORS** is enabled for frontend requests.  

### - Frontend
- Deployment → [Netlify](https://68b2f4d52fd3df6ff8d14960--insyd-notification-system.netlify.app/login)  

### - Run Locally

#### Backend
```bash
cd backend
npm install
npm start

```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Run the App

Visit → **[http://localhost:3000](http://localhost:3000)**

---

## Future Enhancements

* Add user-to-user direct messaging
* Support media uploads in posts
* Introduce push notifications (web & mobile)
* Role-based access control

---

