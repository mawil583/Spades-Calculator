const message = (state = '', action) => {

    switch (action.type) {
        case 'GET_MESSAGE':
            return action.promise;
        default:
            return state;
    }
}

export default message;