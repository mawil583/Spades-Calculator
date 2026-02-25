import {
  Dialog as ChakraDialog,
  Portal,
  type PortalProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

const defaultPortalled =
  typeof process === 'undefined' || process.env.NODE_ENV !== 'test';

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;

export interface DialogBackdropProps extends ChakraDialog.BackdropProps {
  portalled?: boolean;
  portalRef?: PortalProps['container'];
}

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop(props, ref) {
    const { portalled = defaultPortalled, portalRef, ...rest } = props;
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraDialog.Backdrop
          ref={ref}
          zIndex={1409}
          {...rest}
          data-testid="modal-backdrop"
        />
      </Portal>
    );
  },
);
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;

export interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: PortalProps['container'];
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const {
      children,
      portalled = defaultPortalled,
      portalRef,
      ...rest
    } = props;
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraDialog.Positioner
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1410}
          w="100vw"
          h="100dvh"
        >
          <ChakraDialog.Content
            ref={ref}
            zIndex={1411}
            style={{ zIndex: 1411 }}
            {...rest}
          >
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  },
);

export const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
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
  );
});

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
  );
}
