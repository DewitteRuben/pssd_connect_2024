import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikGenderSelectionForm, {
  GenderSelectionPayload,
} from "../../components/GenderSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const GenderSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: GenderSelectionPayload) => {
    registration.setData("gender", payload.gender);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="I am a">
      <FormikGenderSelectionForm onSubmit={onGenderSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(GenderSelection);
