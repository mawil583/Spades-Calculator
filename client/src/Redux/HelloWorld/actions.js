// import fetch from "../../utils/fetch";

export function getMessage() {
  return {
    type: "GET_MESSAGE",
    // CORS error happening here. TODO: include CORS header in fetch
    //    -- actually, it's more likely the server that needs CORS enabled
    // promise: fetch.get(""), // TODO: use native fetch client for better documentation on how to use with CORS
    promise: fetch("", {
      mode: "cors",
      // credentials: true,
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
  };
}
