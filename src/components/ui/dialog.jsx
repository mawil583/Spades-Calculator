import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"

export const DialogRoot = ChakraDialog.Root
export const DialogFooter = ChakraDialog.Footer
export const DialogHeader = ChakraDialog.Header
export const DialogBody = ChakraDialog.Body
export const DialogBackdrop = ChakraDialog.Backdrop
export const DialogTitle = ChakraDialog.Title
export const DialogDescription = ChakraDialog.Description
export const DialogTrigger = ChakraDialog.Trigger
export const DialogActionTrigger = ChakraDialog.ActionTrigger

export const DialogContent = React.forwardRef(
  function DialogContent(props, ref) {
const { children, portalled = typeof process !== 'undefined' && process.env.NODE_ENV !== 'test', portalRef, ...rest } = props
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    )
  },
)

export const DialogCloseTrigger = React.forwardRef(
  function DialogCloseTrigger(props, ref) {
    return (
      <ChakraDialog.CloseTrigger
        position="absolute"
        top="2"
        right="2"
        ref={ref}
        aria-label="Close"
        {...props}
      >
        {props.children || <CloseIcon />}
      </ChakraDialog.CloseTrigger>
    )
  },
)

function CloseIcon() {
  return (
    <svg
      fill="none"
      height="14"
      viewBox="0 0 24 24"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
