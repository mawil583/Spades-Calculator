export default function apiMiddleware() {
    return store => next => action => {
        console.log("middleware is being called");
    return next(action);

        // if (!action.promise) {
        //     console.log("middleware: there was no action.promise");
        //     return next(action);
        // }

        // function callApi (request) {
        //     console.log("callApi middleware funciton is being called");
        //     request.then(response => {

        //         console.log("return from callApi: ", {...action, promise: response} );
                
        //         return {...action, promise: response};
        //     });
        // };
        // console.log("just before callApi gets called");


        // since request is action.promise:
        // return callApi(action.promise);

    };
};