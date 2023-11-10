import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikAppModeSelectionForm, {
  AppModeSelectionPayload,
} from "../../components/AppModeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const AppModeSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onSubmit = async (payload: AppModeSelectionPayload) => {
    // registration.setData("prefGender", payload.prefGender);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="Choose a mode to get started">
      <FormikAppModeSelectionForm onSubmit={onSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(AppModeSelection);
