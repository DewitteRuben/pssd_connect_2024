import { Button, ThemingProps, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";
import { getMessagingToken } from "../firebase/messaging";

type TAllowNotificationButtonProps = {
  onChange?: (token: string, isSupported: boolean) => void;
  size?: ThemingProps<"Button">["size"];
};

const AllowNotificationButton: React.FC<TAllowNotificationButtonProps> = ({
  onChange,
  size,
}) => {
  const toast = useToast();
  const [approvingNotification, setApprovingNotifications] = React.useState(false);

  const onAllowNotificationSubmit = async () => {
    try {
      setApprovingNotifications(true);

      const token = await getMessagingToken();

      if (onChange) {
        onChange(token, true);
      }
    } catch (e) {
      const error = e as { code: string };
      toast({
        title: "Notifications",
        description: "Failed to allow notifications",
        status: "error",
        isClosable: true,
      });

      if (onChange) {
        switch (error.code) {
          case "messaging/token-subscribe-failed": {
            onChange("", false);
            break;
          }
        }
      }
    } finally {
      setApprovingNotifications(false);
    }
  };

  return (
    <Button
      width="100%"
      onClick={onAllowNotificationSubmit}
      colorScheme="green"
      isLoading={approvingNotification}
      size={size ?? "lg"}
      type="submit"
    >
      Allow Notifications
    </Button>
  );
};

export default observer(AllowNotificationButton);
