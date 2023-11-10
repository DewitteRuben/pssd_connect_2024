import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, {
  PSSDDurationSelectionPayload,
} from "../../components/PSSDDurationSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const PSSDDurationSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: PSSDDurationSelectionPayload) => {
    registration.setData("pssd_duration", payload.duration);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="I've had PSSD for">
      <FormikPrefGenderForm onSubmit={onGenderSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(PSSDDurationSelection);
