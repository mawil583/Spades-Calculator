import fetch from "../../utils/fetch";

export function getMessage() {
  return {
    type: "GET_MESSAGE",
    promise: fetch.get(""),
  };
}
