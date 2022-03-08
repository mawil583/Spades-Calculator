const message = (state = "", action) => {
  switch (action.type) {
    case "GET_MESSAGE":
      console.log({ messageAction: action });
      return action.promise;
    default:
      return state;
  }
};

export default message;
