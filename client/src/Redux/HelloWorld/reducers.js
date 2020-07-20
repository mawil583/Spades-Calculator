const message = (state = '', action) => {
    console.log(action);
    switch (action.type) {
        case 'GET_MESSAGE':
            console.log("GET_MESSAGE reducer cl of action: ", action)
            return state
        default:
            console.log("GET_MESSAGE was not dispatched");
            return state
    }
}

export default message;