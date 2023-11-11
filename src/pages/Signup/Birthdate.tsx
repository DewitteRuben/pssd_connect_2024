import FormikBirthdateForm from "../../components/BirthdateForm";
import { observer } from "mobx-react";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import { BirthdatePayload } from "../../components/BirthdateForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";

const Birthdate = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);
  const birthdate = registration.getData("birthdate");

  const onBirthdateSubmit = async (payload: BirthdatePayload) => {
    registration.setData("birthdate", payload.birthdate);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="When's your birthday?">
      <FormikBirthdateForm
        initialValues={{ birthdate: birthdate ? new Date(birthdate) : birthdate }}
        onSubmit={onBirthdateSubmit}
      />
    </RegistrationViewContainer>
  );
};

export default observer(Birthdate);
