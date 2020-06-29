import React from 'react';

const Counter = (props) => {
    return (
    <div>
        <p>My count is {props.count}</p>
        <button onClick={() => {props.increment()}}>Increment</button>
        <button onClick={() => {props.decrement()}}>Decrement</button>
    </div>
    );
}
 
export default Counter;