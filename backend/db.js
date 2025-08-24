// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
// const fs = require('fs');

// // Ensure database directory exists
// const dbPath = path.join(__dirname, '../notification.db');
// const dbDir = path.dirname(dbPath);

// if (!fs.existsSync(dbDir)) {
//     fs.mkdirSync(dbDir, { recursive: true });
//     console.log(`Created database directory: ${dbDir}`);
// }

// // Create database connection
// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error("Failed to connect to SQLite database:", err.message);
//         process.exit(1);
//     } else {
//         console.log("Connected to SQLite database:", dbPath);
//         initializeDatabase();
//     }
// });

// // Initialize database with tables
// function initializeDatabase() {
//     db.serialize(() => {
//         console.log("🔄 Initializing database tables...");
        
//         // USERS table
//         db.run(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 username TEXT NOT NULL UNIQUE,
//                 email TEXT UNIQUE,
//                 avatar_url TEXT DEFAULT 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/99b378ee-90ca-4125-8ea4-45e0f62790b6.png',
//                 bio TEXT,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//             )
//         `, (err) => {
//             if (err) {
//                 console.error("Error creating users table:", err.message);
//             } else {
//                 console.log("Users table created/verified");
//             }
//         });

//         // FOLLOWS table
//         db.run(`
//             CREATE TABLE IF NOT EXISTS follows (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 follower_id INTEGER NOT NULL,
//                 followee_id INTEGER NOT NULL,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
//                 FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE,
//                 UNIQUE(follower_id, followee_id)
//             )
//         `, (err) => {
//             if (err) {
//                 console.error("Error creating follows table:", err.message);
//             } else {
//                 console.log("Follows table created/verified");
//             }
//         });

//         // POSTS table
//         db.run(`
//             CREATE TABLE IF NOT EXISTS posts (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 user_id INTEGER NOT NULL,
//                 content TEXT NOT NULL,
//                 image_url TEXT,
//                 likes_count INTEGER DEFAULT 0,
//                 comments_count INTEGER DEFAULT 0,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//             )
//         `, (err) => {
//             if (err) {
//                 console.error("Error creating posts table:", err.message);
//             } else {
//                 console.log("Posts table created/verified");
//             }
//         });

//         // EVENTS table
//         db.run(`
//             CREATE TABLE IF NOT EXISTS events (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 name TEXT NOT NULL,
//                 description TEXT,
//                 location TEXT,
//                 date DATETIME,
//                 image_url TEXT DEFAULT 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ed9cd809-21f1-4240-947e-3e946326400f.png',
//                 created_by INTEGER,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
//             )
//         `, (err) => {
//             if (err) {
//                 console.error("Error creating events table:", err.message);
//             } else {
//                 console.log("Events table created/verified");
//             }
//         });

//         // NOTIFICATIONS table
//         db.run(`
//             CREATE TABLE IF NOT EXISTS notifications (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 user_id INTEGER NOT NULL,
//                 type TEXT NOT NULL DEFAULT 'info',
//                 message TEXT NOT NULL,
//                 related_id INTEGER,
//                 related_type TEXT,
//                 is_read INTEGER DEFAULT 0,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//             )
//         `, (err) => {
//             if (err) {
//                 console.error("Error creating notifications table:", err.message);
//             } else {
//                 console.log("Notifications table created/verified");
//             }
//         });

//         // Create indexes for better performance
//         db.run(`CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id)`, (err) => {
//             if (err) console.error("Error creating index:", err.message);
//         });
        
//         db.run(`CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee_id)`, (err) => {
//             if (err) console.error("Error creating index:", err.message);
//         });
        
//         db.run(`CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id)`, (err) => {
//             if (err) console.error("Error creating index:", err.message);
//         });
        
//         db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`, (err) => {
//             if (err) console.error("Error creating index:", err.message);
//         });
        
//         db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`, (err) => {
//             if (err) console.error("Error creating index:", err.message);
//         });

//         // Insert sample data if tables are empty
//         setTimeout(() => {
//             insertSampleData();
//         }, 1000);
//     });
// }

// // Insert sample data for testing
// function insertSampleData() {
//     // Check if users table is empty
//     db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
//         if (err) {
//             console.error("Error checking users table:", err.message);
//             return;
//         }

//         if (row.count === 0) {
//             console.log("Inserting sample data...");
            
//             // Insert sample users
//             const sampleUsers = [
//                 ['john_doe', 'john@example.com', 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7c6af287-5133-4a24-b6b3-af71670e9ed2.png', 'Software Developer from San Francisco'],
//                 ['jane_smith', 'jane@example.com', 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ae3fa583-0b43-48b0-bc89-af3592dbbdd7.png', 'Digital Artist from New York'],
//                 ['mike_wilson', 'mike@example.com', 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3c901246-025c-4d4e-85dc-d362dfc25e58.png', 'Product Manager from London']
//             ];

//             sampleUsers.forEach((user, index) => {
//                 db.run(
//                     "INSERT INTO users (username, email, avatar_url, bio) VALUES (?, ?, ?, ?)",
//                     user,
//                     function(err) {
//                         if (err) {
//                             console.error("Error inserting user:", err.message);
//                         } else if (index === sampleUsers.length - 1) {
//                             console.log("Sample users inserted");
//                             insertSamplePosts();
//                         }
//                     }
//                 );
//             });
//         }
//     });
// }

// function insertSamplePosts() {
//     const samplePosts = [
//         [1, 'Just launched my new project! Excited to share it with everyone. #coding #webdev'],
//         [2, 'Working on some new digital art pieces. Can\'t wait to show you all!'],
//         [3, 'Great meeting today with the team. Product roadmap looking solid!']
//     ];

//     samplePosts.forEach((post, index) => {
//         db.run(
//             "INSERT INTO posts (user_id, content) VALUES (?, ?)",
//             post,
//             function(err) {
//                 if (err) {
//                     console.error("Error inserting post:", err.message);
//                 } else if (index === samplePosts.length - 1) {
//                     console.log("Sample posts inserted");
//                     insertSampleEvents();
//                 }
//             }
//         );
//     });
// }

// function insertSampleEvents() {
//     const sampleEvents = [
//         ['Tech Conference 2024', 'Annual technology conference with speakers from top companies', 'San Francisco Convention Center', '2024-03-15 09:00:00', 1],
//         ['Art Exhibition', 'Local artists showcase their latest works', 'Downtown Gallery', '2024-04-20 18:00:00', 2],
//         ['Product Launch Party', 'Celebrating our new product release', 'Tech Hub Office', '2024-05-10 19:00:00', 3]
//     ];

//     sampleEvents.forEach((event, index) => {
//         db.run(
//             "INSERT INTO events (name, description, location, date, created_by) VALUES (?, ?, ?, ?, ?)",
//             event,
//             function(err) {
//                 if (err) {
//                     console.error("Error inserting event:", err.message);
//                 } else if (index === sampleEvents.length - 1) {
//                     console.log("Sample events inserted");
//                     console.log("Database initialization complete!");
//                 }
//             }
//         );
//     });
// }

// // Database utility functions
// db.getUserById = function(id, callback) {
//     this.get("SELECT * FROM users WHERE id = ?", [id], callback);
// };

// db.getUserByUsername = function(username, callback) {
//     this.get("SELECT * FROM users WHERE username = ?", [username], callback);
// };

// db.getPostsByUserId = function(userId, callback) {
//     this.all("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC", [userId], callback);
// };

// db.getNotificationsByUserId = function(userId, callback) {
//     this.all("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", [userId], callback);
// };

// // Graceful shutdown handling
// process.on('SIGINT', () => {
//     console.log('\n🔄 Closing database connection...');
//     db.close((err) => {
//         if (err) {
//             console.error('Error closing database:', err.message);
//         } else {
//             console.log('Database connection closed.');
//         }
//         process.exit(0);
//     });
// });

// module.exports = db;


const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./insyd_full.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) console.error("❌ DB Error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS followers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    followerId INTEGER,
    followingId INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    postId INTEGER,
    type TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    message TEXT,
    isRead INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
