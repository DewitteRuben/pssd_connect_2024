import FormikPhoneNumberForm from "../../components/PhoneNumberForm";
import { observer } from "mobx-react";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";

const PhoneNumber = observer(() => {
  const onPhoneNumberSubmit = async (payload: any) => {
    console.log(payload);
  };

  return (
    <RegistrationViewContainer title="My first name is">
      <FormikPhoneNumberForm onSubmit={onPhoneNumberSubmit} />
    </RegistrationViewContainer>
  );
});

export default PhoneNumber;
