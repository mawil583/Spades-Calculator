import fetch from "../../utils/fetch";

export function getBlogPosts() {
  return {
    type: "GET_BLOG_POSTS",
    promise: fetch.get("entries"),
  };
}
