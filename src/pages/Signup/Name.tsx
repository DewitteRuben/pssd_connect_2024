import FormikNameForm, { NamePayload } from "../../components/NameForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const Name = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onNameSubmit = async (payload: NamePayload) => {
    registration.setData("firstName", payload.name);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="My first name is">
      <FormikNameForm onSubmit={onNameSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(Name);
