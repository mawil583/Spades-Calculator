export function getMessage() {
  return {
    type: "GET_MESSAGE",
    promise: fetch("/helloWorld", {
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    }),
  };
}
