import { Button, ThemingProps } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";
import { getMessagingToken } from "../firebase/messaging";

type TAllowNotificationButtonProps = {
  onChange?: (token: string) => void;
  size?: ThemingProps<"Button">["size"];
};

const AllowNotificationButton: React.FC<TAllowNotificationButtonProps> = ({
  onChange,
  size,
}) => {
  const [approvingNotification, setApprovingNotifications] = React.useState(false);
  const [notificationToken, setNotificationToken] = React.useState<string>();

  const onAllowNotificationSubmit = async () => {
    try {
      setApprovingNotifications(true);

      const token = await getMessagingToken();

      if (onChange) {
        onChange(token);
      }

      setNotificationToken(token);
    } catch (error) {
      // TODO: add toast
      console.error(error);
    } finally {
      setApprovingNotifications(false);
    }
  };

  return (
    <Button
      onClick={onAllowNotificationSubmit}
      colorScheme="green"
      isDisabled={!!notificationToken}
      isLoading={approvingNotification}
      size={size ?? "lg"}
      type="submit"
    >
      Allow Notifications
    </Button>
  );
};

export default observer(AllowNotificationButton);
