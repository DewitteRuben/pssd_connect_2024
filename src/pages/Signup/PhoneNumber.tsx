import FormikPhoneNumberForm, {
  PhoneNumberFormPayload,
} from "../../components/PhoneNumberForm";
import { observer } from "mobx-react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { RegistrationStoreContext } from "../../store/registration";
import React from "react";
import { useNavigate } from "react-router-dom";

const PhoneNumber = () => {
  const navigate = useNavigate();
  const registration = React.useContext(RegistrationStoreContext);

  const onPhoneNumberSubmit = async (payload: PhoneNumberFormPayload) => {
    registration.setData("countryCode", payload.country_code);
    registration.setData("phoneNumber", payload.phone_number);
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="Verify your phone number">
      <FormikPhoneNumberForm onSubmit={onPhoneNumberSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(PhoneNumber);
