const blogPosts = (state = [], action) => {
  switch (action.type) {
    case "GET_BLOG_POSTS":
      const response = JSON.parse(action.promise);
      const blogPosts = response.items.map((item) => {
        return item.fields.body.content[0].content[0].value;
      });
      return blogPosts;
    default:
      return state;
  }
};

export default blogPosts;
