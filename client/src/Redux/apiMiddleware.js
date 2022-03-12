const apiMiddleware = (store) => (next) => (action) => {
  if (!action.promise) {
    return next(action);
  }

  function callApi(request) {
    request
      .then((response) => {
        // TODO: may not need this if/else. Simplify
        if (response.text) {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then(function (data) {
        return next({ ...action, promise: data });
      });
  }

  // since request is action.promise:
  return callApi(action.promise);
};
export default apiMiddleware;
