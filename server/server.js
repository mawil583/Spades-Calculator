'use strict';

const Hapi = require('@hapi/hapi');
// look up @hapi/joi for more convenient routing

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const response = h.response("Hello World!");
            return response;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
