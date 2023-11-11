import FormikNameForm, { NamePayload } from "../../components/NameForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const Name = () => {
  const registration = React.useContext(RegistrationStoreContext);
  const firstName = registration.getData("firstName");
  const navigate = useNavigate();

  const onNameSubmit = async (payload: NamePayload) => {
    registration.setData("firstName", payload.firstName);
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
