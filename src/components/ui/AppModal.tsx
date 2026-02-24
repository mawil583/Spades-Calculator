import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
} from "./dialog";
import type { ReactNode } from "react";
import type { BoxProps, DialogRootProps } from "@chakra-ui/react";

export interface AppModalProps extends Omit<DialogRootProps, "children"> {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  title?: string;
  children: ReactNode;
  contentStyle?: BoxProps;
  headerStyle?: BoxProps;
  bodyStyle?: BoxProps;
  closeButtonColor?: string;
  contentProps?: BoxProps;
  showCloseButton?: boolean;
}

function AppModal({
  isOpen,
  onClose,
  title,
  children,
  contentStyle = {},
  headerStyle = {},
  bodyStyle = {},
  closeButtonColor = "offWhite",
  contentProps = {},
  showCloseButton = true,
  ...rest
}: AppModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => onClose(e.open)} {...rest}>
      <DialogBackdrop
        style={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />
      <DialogContent
        bg="bg"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        borderColor="whiteAlpha.100"
        borderWidth="1px"
        mx={4}
        my="auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        {...contentStyle}
        {...contentProps}
      >
        {title && (
          <DialogHeader
            fontSize="2xl"
            fontWeight="bold" // Bold is fine for a heading, but could be var(--app-font-weight-bold) if we defined it. Let's keep it bold for now as it's standard.
            pe="40px"
            {...headerStyle}
          >
            {title}
          </DialogHeader>
        )}
        {showCloseButton && (
          <DialogCloseTrigger
            color={closeButtonColor}
            top="10px"
            right="10px"
          />
        )}
        <DialogBody p="5px" {...bodyStyle}>
          {children}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default AppModal;
