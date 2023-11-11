import { observer } from "mobx-react";
import { Mode, RegistrationStoreContext } from "../../store/registration";
import React from "react";
import FormikAppModeSelectionForm, {
  AppModeSelectionPayload,
} from "../../components/AppModeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const AppModeSelection = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);
  const mode = registration.getData("mode") ?? "dating";

  const onSubmit = async (payload: AppModeSelectionPayload) => {
    registration.setData("mode", payload.mode);
    registration.setMode(payload.mode as Mode);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="Choose a mode to get started">
      <FormikAppModeSelectionForm initialValues={{ mode }} onSubmit={onSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(AppModeSelection);
