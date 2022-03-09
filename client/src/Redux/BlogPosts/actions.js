export function getBlogPosts() {
  return {
    type: "GET_BLOG_POSTS",
    promise: fetch("entries", {
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
  };
}
