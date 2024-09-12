import { useToast } from "@chakra-ui/react";
import FormikEmailRegistrationForm, {
  EmailRegistrationPayload,
} from "../../components/EmailRegistrationForm";
import { observer } from "mobx-react";
import { AuthError } from "firebase/auth";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const EmailRegistration = () => {
  const { auth, registration } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  const onEmailRegSubmit = async ({ email, password }: EmailRegistrationPayload) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);

      const next = registration.nextStep();
      registration.updateRegistrationData({ email });
      navigate(next.step);
    } catch (e) {
      const err = e as AuthError;
      toast({
        title: "Failed to send verification code",
        description: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        
      });
    }
  };

  return (
    <RegistrationViewContainer title="Create your account">
      <FormikEmailRegistrationForm onSubmit={onEmailRegSubmit} />
    </RegistrationViewContainer>
  );
};

export default observer(EmailRegistration);
