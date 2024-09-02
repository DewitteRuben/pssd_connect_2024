import { observer } from "mobx-react";
import { Mode } from "../../store/registration";
import FormikAppModeSelectionForm, {
  AppModeSelectionPayload,
} from "../../components/AppModeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { RelationshipMode } from "../../backend/src/database/user/types";

const AppModeSelection = () => {
  const navigate = useNavigate();
  const { registration } = useStore();
  const mode = (registration.getData("mode") as string) ?? "dating";

  const onSubmit = async (payload: AppModeSelectionPayload) => {
    registration.updateRegistrationData({ mode: payload.mode as RelationshipMode });
    registration.setMode(payload.mode as Mode);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="How do you want to connect?">
      <FormikAppModeSelectionForm initialValues={{ mode }} onSubmit={onSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(AppModeSelection);
