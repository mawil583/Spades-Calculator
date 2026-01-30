import React from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
} from './dialog';
import { X } from 'lucide-react';

function AppModal({
  isOpen,
  onClose,
  title,
  children,
  contentStyle = {},
  headerStyle = {},
  bodyStyle = {},
  closeButtonColor = '#ebf5ee',
  contentProps = {},
  ...rest
}) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => onClose(e.open)}
      {...rest}
    >
      <DialogBackdrop
        backdropFilter="blur(4px)"
        bg="blackAlpha.600"
      />
      <DialogContent
        bg="bg"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        borderColor="whiteAlpha.100"
        borderWidth="1px"
        m={4}
        {...contentStyle}
        {...contentProps}
      >
        {title && (
          <DialogHeader
            fontSize="2xl"
            fontWeight="bold"
            css={headerStyle}
          >
            {title}
          </DialogHeader>
        )}
        <DialogCloseTrigger
          color={closeButtonColor}
          top="10px"
          right="10px"
          css={headerStyle} // Using headerStyle for consistency if needed, but DialogCloseTrigger usually has its own style
        >
          <X size={24} />
        </DialogCloseTrigger>
        <DialogBody p="5px" css={bodyStyle}>
          {children}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default AppModal;
