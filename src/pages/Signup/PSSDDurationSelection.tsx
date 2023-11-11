import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikPrefGenderForm, {
  PSSDDurationSelectionPayload,
} from "../../components/PSSDDurationSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const PSSDDurationSelection = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);

  const onGenderSubmit = async (payload: PSSDDurationSelectionPayload) => {
    registration.setData("pssd_duration", payload.duration);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="I've had PSSD for">
      <FormikPrefGenderForm onSubmit={onGenderSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(PSSDDurationSelection);
