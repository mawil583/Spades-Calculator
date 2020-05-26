import Client from '@synapsestudios/fetch-client';

const fetch = new Client({
    url: "http://localhost:5000"
});

export default fetch;