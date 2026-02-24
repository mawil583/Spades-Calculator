import {
  FieldRoot,
  FieldLabel,
  FieldHelperText,
  FieldErrorText,
  type FieldRootProps,
} from "@chakra-ui/react"
import { forwardRef, type ReactNode } from "react"

export interface FieldProps extends Omit<FieldRootProps, "label"> {
  label?: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  optionalText?: ReactNode
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(props, ref) {
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
