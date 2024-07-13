import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/loadPosts.js';

const PostList = () => {
  const posts = getPosts();

  return (
    <div>
      <h1>文章列表</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              {post.title} - {post.date} - {post.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
