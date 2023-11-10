import FormikBirthdateForm from "../../components/BirthdateForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import { BirthdatePayload } from "../../components/BirthdateForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const Birthdate = () => {
  const registration = React.useContext(RegistrationStoreContext);

  const onBirthdateSubmit = async (payload: BirthdatePayload) => {
    registration.setData("birthdate", payload.birthdate);
    registration.nextStep();
  };

  return (
    <RegistrationViewContainer title="My birthday is">
      <FormikBirthdateForm onSubmit={onBirthdateSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(Birthdate);
