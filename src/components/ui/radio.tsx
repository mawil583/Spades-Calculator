import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import { forwardRef } from "react"

export const RadioGroup = ChakraRadioGroup.Root

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio(props, ref) {
  const { children, inputProps, ...rest } = props
  return (
    <ChakraRadioGroup.Item ref={ref} {...rest} cursor="pointer" py="1" display="flex" alignItems="center" width="fit-content">
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
        css={{
          '&[data-state=checked]': {
            bg: 'transparent !important',
          }
        }}
      />
      {children && (
        <ChakraRadioGroup.ItemText className="radio-label" ml="2" fontSize="md" display="inline-block">{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  )
})
