import React, { useEffect } from "react";

const HelloWorld = (props) => {
  useEffect(() => {
    props.getMessage();
  }, []);

  return (
    <div>
      <h1>The message I have for the world is: "{props.message}" </h1>
    </div>
  );
};

export default HelloWorld;
