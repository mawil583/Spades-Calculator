import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"
import React from 'react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ md: "16" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.indicator && <Toast.Indicator>{toast.indicator}</Toast.Indicator>}
            <Stack gap="1" flex="1">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
