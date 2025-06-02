import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/posts/?page=${page}`);
      setPosts(prev => [...prev, ...res.data.results]);
      setNext(res.data.next);
      if (res.data.next) {
        const params = new URLSearchParams(res.data.next.split('?')[1]);
        const newPage = parseInt(params.get('page'));
        if (!isNaN(newPage)) setPage(newPage);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post.uuid}>{post.title}</div>
      ))}
      {next && (
        <button onClick={loadPosts} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default Feed;
