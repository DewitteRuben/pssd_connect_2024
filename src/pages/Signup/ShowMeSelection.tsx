import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, {
  PrefGenderPayload,
} from "../../components/ShowMeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const ShowMeSelection = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);
  const prefGender = registration.getData("prefGender") ?? "women";

  const onGenderSubmit = async (payload: PrefGenderPayload) => {
    registration.setData("prefGender", payload.prefGender);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="Who are you interested in?">
      <FormikPrefGenderForm initialValues={{ prefGender }} onSubmit={onGenderSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(ShowMeSelection);
