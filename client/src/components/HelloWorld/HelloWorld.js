import React, { useEffect } from "react";

const HelloWorld = (props) => {
  const { getMessage, message } = props;

  useEffect(() => {
    // console.log({ props });
    getMessage();
  }, [getMessage]);

  return (
    <div>
      <h1>The message I have for the world is: "{message}" </h1>
    </div>
  );
};

export default HelloWorld;
