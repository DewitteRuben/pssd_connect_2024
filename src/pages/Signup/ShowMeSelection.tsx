import { Box, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, {
  PrefGenderPayload,
} from "../../components/ShowMeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const ShowMeSelection = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: PrefGenderPayload) => {
    registration.setData("prefGender", payload.prefGender);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="Who are you interested in?">
      <FormikPrefGenderForm onSubmit={onGenderSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(ShowMeSelection);
