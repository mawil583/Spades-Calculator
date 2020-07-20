const apiMiddleware = store => next => action => {

    if (!action.promise) {
        return next(action);
    }

    function callApi (request) {

        request.then(response => {
            return response.text();
        }).then(function(data) {
            return next({...action, promise: data})
        })
        
    };

    // since request is action.promise:
    return callApi(action.promise);    
}
export default apiMiddleware;
