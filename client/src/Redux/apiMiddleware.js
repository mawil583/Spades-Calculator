const apiMiddleware = (store) => (next) => (action) => {
  if (!action.promise) {
    return next(action);
  }

  function callApi(request) {
    console.log({ request });
    request
      .then((response) => {
        console.log({ response });
        console.log({ body: response.body });
        // console.log({ text: response.text() });
        // console.log({ json: response.json() });
        if (response.text) {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then(function (data) {
        console.log({ data });
        return next({ ...action, promise: data });
      });
  }

  // since request is action.promise:
  return callApi(action.promise);
};
export default apiMiddleware;
