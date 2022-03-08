// import fetch from "../../utils/fetch";

export function getBlogPosts() {
  // TODO: after contentful accessToken is set up, I can uncomment to get blog entries
  return {
    type: "GET_BLOG_POSTS",
    // promise: fetch.get("entries"),
    promise: fetch("entries", {
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
  };
}
