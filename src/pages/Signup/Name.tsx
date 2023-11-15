import FormikNameForm, { NamePayload } from "../../components/NameForm";
import { observer } from "mobx-react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const Name = () => {
  const { registration } = useStore();
  const firstName = registration.getData("firstName") as string;
  const navigate = useNavigate();

  const onNameSubmit = async (payload: NamePayload) => {
    registration.updateRegistrationData({ firstName: payload.firstName });
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="What's your first name?">
      <FormikNameForm
        initialValues={{ firstName: firstName ?? "" }}
        onSubmit={onNameSubmit}
      />
    </RegistrationViewContainer>
  );
};

export default observer(Name);
