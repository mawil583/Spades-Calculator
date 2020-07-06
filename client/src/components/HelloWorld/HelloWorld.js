import React, { useState, useEffect } from 'react';
// import fetch from '../../utils/fetch';

const HelloWorld = (props) => {

    // const [message, setMessage] = useState('');

    useEffect(() => {
        props.getMessage()
        // async function callRootRoute () {
        //     try {
        //         const helloWorld = await fetch.get("");
        //         const response = await helloWorld.text();
        //         setMessage(response);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // };
        // callRootRoute();
    }, []);

    console.log("props: ", props);

    return (
        <div>
            <h1>The message I have for the world is: "{props.message}" </h1>
        </div>
    );
}

export default HelloWorld;