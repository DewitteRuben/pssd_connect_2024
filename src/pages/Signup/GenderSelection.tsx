import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import FormikGenderSelectionForm, {
  GenderSelectionPayload,
} from "../../components/GenderSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useStore } from "../../store/store";

const GenderSelection = () => {
  const navigate = useNavigate();
  const { registration } = useStore();
  const gender = registration.getData("gender") as string;

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
