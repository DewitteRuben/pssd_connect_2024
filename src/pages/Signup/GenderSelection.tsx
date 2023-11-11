import React from "react";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import { useNavigate } from "react-router-dom";
import FormikGenderSelectionForm, {
  GenderSelectionPayload,
} from "../../components/GenderSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const GenderSelection = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);
  const gender = registration.getData("gender");

  const onGenderSubmit = async (payload: GenderSelectionPayload) => {
    registration.setData("gender", payload.gender);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="How do you identify?">
      <FormikGenderSelectionForm
        initialValues={{ gender: gender ?? "woman" }}
        onSubmit={onGenderSubmit}
      />
    </RegistrationViewContainer>
  );
};

export default observer(GenderSelection);
