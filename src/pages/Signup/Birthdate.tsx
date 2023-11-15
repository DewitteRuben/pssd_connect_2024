import FormikBirthdateForm from "../../components/BirthdateForm";
import { observer } from "mobx-react";
import { BirthdatePayload } from "../../components/BirthdateForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const Birthdate = () => {
  const navigate = useNavigate();
  const { registration } = useStore();
  const birthdate = registration.getData("birthdate") as string;

  const onBirthdateSubmit = async (payload: BirthdatePayload) => {
    registration.updateRegistrationData({ birthdate: payload.birthdate });
    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="When's your birthday?">
      <FormikBirthdateForm
        initialValues={{
          birthdate: birthdate ? new Date(birthdate) : new Date("2000-01-01"),
        }}
        onSubmit={onBirthdateSubmit}
      />
    </RegistrationViewContainer>
  );
};

export default observer(Birthdate);
