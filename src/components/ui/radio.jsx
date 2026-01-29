import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import * as React from "react"

export const RadioGroup = ChakraRadioGroup.Root

export const Radio = React.forwardRef(function Radio(props, ref) {
  const { children, inputProps, ...rest } = props
  return (
    <ChakraRadioGroup.Item ref={ref} {...rest} sx={{ cursor: 'pointer', padding: '4px 0', display: 'flex !important', alignItems: 'center !important', width: 'fit-content !important' }}>
      <ChakraRadioGroup.ItemHiddenInput {...inputProps} />
      <ChakraRadioGroup.ItemIndicator
        width="20px"
        height="20px"
        borderWidth="2px"
        borderColor="gray.500"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        _checked={{
          borderColor: "blue.400",
          _before: {
            content: '""',
            display: "block",
            width: "10px",
            height: "10px",
            borderRadius: "full",
            bg: "blue.400",
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }
        }}
        position="relative"
        /* Remove the background color from theme override */
        sx={{
          '&[data-state=checked]': {
            bg: 'transparent !important',
          }
        }}
      />
      {children && (
        <ChakraRadioGroup.ItemText className="radio-label" sx={{ marginLeft: '8px', fontSize: '16px', display: 'inline-block !important' }}>{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  )
})
