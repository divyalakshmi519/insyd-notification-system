# INSYD Notification System – Proof of Concept (POC)

## Overview
The **INSYD Notification System** is a proof of concept (POC) that demonstrates how notifications can be triggered and delivered in a social media–like application.  
It integrates **database design, backend APIs, and frontend UI** into a single working model, making it easy to understand how DBMS concepts are applied in real-world applications.

---

## Notification POC – How It Works

- **User Registration & Login**  
  - Users are uniquely identified and stored in the database.  
  - Authentication ensures only registered users can access the system.  

- **Creating Posts**  
  - Logged-in users can create posts.  
  - Each post is tied to the user and stored with a timestamp.  

- **Generating Notifications**  
  - When another user interacts (likes, comments, or follows), a notification entry is automatically created.  
  - These notifications are stored in the database with event details.  

- **Viewing Notifications**  
  - The frontend shows a notification icon with a count in the header.  
  - Clicking the icon reveals all unread notifications for the user.  

- **Real-time Updates**  
  - As soon as a new event occurs, the notification list updates dynamically without refreshing the page.  

---

## Tech Stack

- **Database:** SQLite (lightweight for POC, scalable to MySQL/PostgreSQL)  
- **Backend:** Node.js + Express.js REST APIs  
- **Frontend:** React.js with modular components *(Login, Home, Header, Notifications, PostForm)*  
- **Deployment:**  
  - Frontend → **Netlify**  
  - Backend → **Railway**  
- **Version Control:** GitHub for collaboration and updates  

---

## Database Schema

The system uses relational tables to handle users, posts, and notifications:

- **Users Table** → stores login and identity details  
- **Posts Table** → stores all user posts  
- **Notifications Table** → stores events like likes, comments, and follows linked to users  

Detailed relationships are shown in the **ER Diagram**.  

---

## Features

- **Secure Login System**  
- **Post Creation & Management**  
- **Dynamic Notifications with Count Badge**  
- **Notification History View**  
- **Real-time Updates Without Page Reload**  
- **Responsive UI for seamless use**  

---

## 🏁 Getting Started

### Database Setup
```bash
Run the SQL script `notifications.sql` to initialize tables.
````

### Backend Setup

```bash
cd server
npm install
npm start
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Run the App

Visit → **[http://localhost:5173](http://localhost:5173)**

---

## Future Enhancements

* Add user-to-user direct messaging
* Support media uploads in posts
* Introduce push notifications (web & mobile)
* Role-based access control

---

