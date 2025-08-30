const express = require('express');
const cors = require('cors');
const db = require('./db');

const usersRoutes = require('./routes/usersRoutes');
const postsRoutes = require('./routes/postsRoutes');
const likesRoutes = require('./routes/likesRoutes');
const followersRoutes = require('./routes/followersRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes(db));
app.use('/api/posts', postsRoutes(db));
app.use('/api/likes', likesRoutes(db));
app.use('/api/followers', followersRoutes(db));
app.use('/api/notifications', notificationsRoutes(db));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
