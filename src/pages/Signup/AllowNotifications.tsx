import { Button, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useMessagingSupported } from "../../firebase/messaging";
import React from "react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import AllowNotificationButton from "../../components/AllowNotificationButton";

const AllowNotifications = () => {
  const navigate = useNavigate();

  const {
    registration,
    user: { user: userData },
  } = useStore();

  const isFbMessagingSupported = useMessagingSupported();
  const [isGetTokenSupported, setGetTokenSupported] = React.useState(true);

  const [notificationToken, setNotificationToken] = React.useState<string>(
    userData?.notificationToken ?? ""
  );

  const handleOnAllowNotifications = (
    notificationToken: string,
    isSupported: boolean
  ) => {
    if (isSupported) {
      setNotificationToken(notificationToken);
      registration.updateRegistrationData({ notificationToken });
    } else {
      setGetTokenSupported(false);
    }
  };

  const onContinue = async () => {
    try {
      await registration.finish();
      navigate("/");
    } catch (error) {
      console.error("Failed to finish registration", error);
    }
  };

  return (
    <RegistrationViewContainer title="Enable Notifications">
      {!notificationToken && isFbMessagingSupported && (
        <>
          <Text align="center">
            We will send you a notification whenever a match has been found.
          </Text>
          <AllowNotificationButton onChange={handleOnAllowNotifications} size="md" />
        </>
      )}

      {notificationToken && (
        <>
          <Text align="center">We've successfully read your location</Text>
          <Button onClick={onContinue} colorScheme="green" size="lg">
            FINISH REGISTRATION
          </Button>
        </>
      )}

      {!notificationToken && (!isFbMessagingSupported || !isGetTokenSupported) && (
        <>
          <Text align="center">
            Unfortunately, notifications are not supported in your browser.
          </Text>
          <Text align="center">
            Consider using a different browser after finishing the registration.
          </Text>
          <Button onClick={onContinue} colorScheme="green" size="lg">
            FINISH REGISTRATION
          </Button>
        </>
      )}
    </RegistrationViewContainer>
  );
};

export default observer(AllowNotifications);
