import React, { useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const BlogPosts = (props) => {
  const { getBlogPosts, blogPosts } = props;

  useEffect(() => {
    getBlogPosts();
  }, [getBlogPosts]);

  return (
    <div>
      <h1>Here are my blog posts: </h1>
      {blogPosts.map((blogPost, i) => (
        <p key={i}>{documentToReactComponents(blogPost)}</p>
      ))}
    </div>
  );
};

export default BlogPosts;
