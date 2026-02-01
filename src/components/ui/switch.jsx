import { Switch as ChakraSwitch } from "@chakra-ui/react";
import { forwardRef } from "react";

export const Switch = forwardRef(function Switch(props, ref) {
  return (
    <ChakraSwitch.Root ref={ref} {...props}>
      <ChakraSwitch.HiddenInput />
      <ChakraSwitch.Control 
        borderWidth="1px" 
        borderColor="whiteAlpha.400"
        _checked={{ borderColor: "blue.400" }}
      />
      <ChakraSwitch.Label>{props.children}</ChakraSwitch.Label>
    </ChakraSwitch.Root>
  );
});
