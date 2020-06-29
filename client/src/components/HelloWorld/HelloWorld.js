import React, { useState, useEffect } from 'react';
import fetch from '../../utils/fetch';

const HelloWorld = () => {

    const [message, setMessage] = useState('');

    useEffect(() => {
        async function callRootRoute () {
            try {
                const helloWorld = await fetch.get("");
                const response = await helloWorld.text();
                setMessage(response);
            } catch (error) {
                console.error(error);
            }
        };
        callRootRoute();
    }, []);

    return (
        <div>
            <h1>The message I have for the world is: "{message}" </h1>
        </div>
    );
}

export default HelloWorld;