import React, { useState, useEffect } from "react";
import "./index.css";

function Posts({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchPosts = () => {
    fetch("http://localhost:5000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const createPost = () => {
    if (!content.trim()) return;
    fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, content })
    })
      .then(res => res.json())
      .then(() => { setContent(""); fetchPosts(); });
  };

  const likePost = (postId, type) => {
    fetch("http://localhost:5000/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, postId, type })
    }).then(() => fetchPosts());
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="posts-container">
      <div className="create-post">
        <textarea placeholder="Write something..." value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={createPost}>Post</button>
      </div>

      {posts.map(p => (
        <div key={p.id} className="post-card">
          <b>{p.username}</b>
          <p>{p.content}</p>
          <div className="post-actions">
            <button onClick={() => likePost(p.id, "like")}>👍</button>
            <button onClick={() => likePost(p.id, "dislike")}>👎</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Posts;
