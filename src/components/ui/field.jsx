import {
  FieldRoot,
  FieldLabel,
  FieldHelperText,
  FieldErrorText,
} from "@chakra-ui/react"
import * as React from "react"

export const Field = React.forwardRef(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, ...rest } = props
  return (
    <FieldRoot ref={ref} {...rest}>
      {label && (
        <FieldLabel>
          {label}
          {optionalText && (
            <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '4px' }}>
              {optionalText}
            </span>
          )}
        </FieldLabel>
      )}
      {children}
      {helperText && <FieldHelperText>{helperText}</FieldHelperText>}
      {errorText && <FieldErrorText color="red.300">{errorText}</FieldErrorText>}
    </FieldRoot>
  )
})
