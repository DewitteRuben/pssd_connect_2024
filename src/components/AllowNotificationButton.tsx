import { Button, ThemingProps } from "@chakra-ui/react";
import { observer } from "mobx-react";
import React from "react";
import { getMessagingToken } from "../firebase/messaging";
import { useStore } from "../store/store";

type TAllowNotificationButtonProps = {
  onChange?: (token: string) => void;
  size?: ThemingProps<"Button">["size"];
};

const AllowNotificationButton: React.FC<TAllowNotificationButtonProps> = ({
  onChange,
  size,
}) => {
  const {
    user: { user: userData },
  } = useStore();

  const [approvingNotification, setApprovingNotifications] = React.useState(false);
  const [notificationToken, setNotificationToken] = React.useState<string>(
    userData?.notificationToken ?? ""
  );

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
      isLoading={approvingNotification}
      size={size ?? "lg"}
      type="submit"
    >
      Allow Notifications
    </Button>
  );
};

export default observer(AllowNotificationButton);
