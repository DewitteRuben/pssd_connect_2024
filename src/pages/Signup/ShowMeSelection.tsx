import { observer } from "mobx-react";
import FormikPrefGenderForm, {
  PrefGenderPayload,
} from "../../components/ShowMeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const ShowMeSelection = () => {
  const navigate = useNavigate();
  const { registration } = useStore();
  const prefGender = (registration.getData("prefGender") as string) ?? "women";

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
