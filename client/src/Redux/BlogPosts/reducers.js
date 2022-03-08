const blogPosts = (state = [], action) => {
  switch (action.type) {
    case "GET_BLOG_POSTS":
      console.log({ blogPostAction: action });
      const response = JSON.parse(action.promise);
      const blogPosts = response.items.map((item) => {
        return item.fields.body;
      });
      return blogPosts;
    default:
      return state;
  }
};

export default blogPosts;
