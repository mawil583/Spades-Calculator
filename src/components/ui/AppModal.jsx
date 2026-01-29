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
        style={{
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
      />
      <DialogContent
        bg="#252d3d"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        borderColor="rgba(255, 255, 255, 0.1)"
        borderWidth="1px"
        m={4}
        {...contentStyle}
        {...contentProps}
      >
        {title && (
          <DialogHeader
            fontSize="2xl"
            fontWeight="bold"
            style={headerStyle}
          >
            {title}
          </DialogHeader>
        )}
        <DialogCloseTrigger
          style={{
            color: closeButtonColor,
            top: '10px',
            right: '10px',
          }}
        >
          <X size={24} />
        </DialogCloseTrigger>
        <DialogBody style={{ padding: '5px', ...bodyStyle }}>
          {children}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default AppModal;
