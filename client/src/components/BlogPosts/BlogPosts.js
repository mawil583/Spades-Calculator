import React, { useEffect } from "react";

const BlogPosts = (props) => {
  useEffect(() => {
    props.getBlogPosts();
  });

  return (
    <div>
      <h1>Here are my blog posts: </h1>
      {props.blogPosts.map((blogPost, i) => (
        <p key={i}>{blogPost}</p>
      ))}
    </div>
  );
};

export default BlogPosts;
