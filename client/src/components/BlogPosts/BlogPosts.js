import React, { useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import richContentConfig from "../../config/contentfulRichContent";

const BlogPosts = (props) => {
  const { getBlogPosts, blogPosts } = props;

  useEffect(() => {
    getBlogPosts();
  }, [getBlogPosts]);

  return (
    <div>
      <h1>Here are my blog posts: </h1>
      {blogPosts.map((blogPost, i) => (
        <div key={i}>
          {documentToReactComponents(blogPost, richContentConfig)}
        </div>
      ))}
    </div>
  );
};

export default BlogPosts;
