const message = (state = '', action) => {
    switch (action.type) {
        case 'GET_MESSAGE':
            console.log("GET_MESSAGE reducer cl of action: ", action)
            break;
        default:
            console.log("GET_MESSAGE was not dispatched");
            return state
    }
}

export default message;