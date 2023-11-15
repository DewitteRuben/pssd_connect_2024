import { observer } from "mobx-react";
import FormikPrefGenderForm, {
  PrefGenderPayload,
} from "../../components/ShowMeSelectionForm";
import RegistrationViewContainer from "../../components/RegistrationViewContainer";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { UserPreferences } from "../../backend/src/database/user/user";

const ShowMeSelection = () => {
  const navigate = useNavigate();
  const { registration } = useStore();
  const preferences = registration.getData("preferences") as UserPreferences;
  const { genderPreference } = preferences;

  const onGenderSubmit = async (payload: PrefGenderPayload) => {
    registration.updateRegistrationData({
      preferences: {
        genderPreference: payload.genderPreference,
      },
    });

    const next = registration.nextStep();
    navigate(next.step);
  };

  return (
    <RegistrationViewContainer title="Who are you interested in?">
      <FormikPrefGenderForm
        initialValues={{ genderPreference }}
        onSubmit={onGenderSubmit}
      />
    </RegistrationViewContainer>
  );
};

export default observer(ShowMeSelection);
