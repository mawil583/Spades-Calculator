import React, { useState, useEffect } from 'react';
import fetch from '../utils/fetch';

const Weather = () => {

    const [message, setMessage] = useState('');

    useEffect(async () => {
        const helloWorld = await fetch.get("")
            .then(response => {
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

// function deathStats (current, beforeCovid) {
//     const deathRate = (1 - (current / beforeCovid)) * 100;
//     console.log(`Death Rate: ${deathRate}%`);
// };

// // or

// function deathStats2 (confirmedDeathToll, nycPopBeforeCovid) {
//     const currentPop = nycPopBeforeCovid - confirmedDeathToll;
//     const deathRate = (1 - (currentPop / nycPopBeforeCovid)) * 100;
//     console.log(`Death Rate: ${deathRate}%`);
// };

// function deathStats3 (confirmedDeathToll, nycPopBeforeCovid) {
//     const deathRate = (confirmedDeathToll / nycPopBeforeCovid) * 100;
//     const errorRange = 0.5/100; // 0.5% as a number
//     const highestCensusPopEstimate = nycPopBeforeCovid + (nycPopBeforeCovid * errorRange);
//     const lowestCensusPopEstimate = nycPopBeforeCovid - (nycPopBeforeCovid * errorRange);
//     const deathRateHigh = (confirmedDeathToll / lowestCensusPopEstimate) * 100;
//     const deathRateLow = (confirmedDeathToll / highestCensusPopEstimate) * 100;
//     console.log(`Death Rate Low: ${deathRateLow.toFixed(4)}`);
//     console.log(`Death Rate middle: ${deathRate.toFixed(4)}%`);
//     console.log(`Death Rate High: ${deathRateHigh.toFixed(4)}`);
// };