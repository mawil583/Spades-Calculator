import React, { useState, useEffect } from 'react';
import fetch from '../utils/fetch';

const Weather = () => {

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch.get("")
        .then(response =>  {
            // console.log("response: ", response);
            // console.log("response.json(): ",response.json());
            // return response.json();
            return response.text();
        })
        .then(data => {
            setMessage(data)
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
          })
    }, []);

    return (
        <div>
            <h1>The message I have for the world is: "{message}" </h1>
        </div>
    );
}

export default Weather;