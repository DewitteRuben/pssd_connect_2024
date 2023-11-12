import { observer } from "mobx-react";
import FormikPrefGenderForm, {
  PSSDDurationSelectionPayload,
} from "../../components/PSSDDurationSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const PSSDDurationSelection = () => {
  const navigate = useNavigate();
  const { registration } = useStore()

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
