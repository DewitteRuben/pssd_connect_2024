import { Routes, Route, Outlet, Navigate, useParams } from "react-router-dom";
import AllowNotifications from "../Signup/AllowNotifications";
import Login from "../Login/Login";
import { observer } from "mobx-react";
import Home from "../Home/Home";
import Entry from "../Entry/Entry";
import EmailRegistration from "../Signup/EmailRegistration";
import { Step } from "../../store/registration";
import PhoneNumber from "../Signup/PhoneNumber";
import Name from "../Signup/Name";
import Birthdate from "../Signup/Birthdate";
import GenderSelection from "../Signup/GenderSelection";
import ShowMeSelection from "../Signup/ShowMeSelection";
import PSSDDurationSelection from "../Signup/PSSDDurationSelection";
import AddPhotos from "../Signup/AddPhotos";
import AllowLocation from "../Signup/AllowLocation";
import AppModeSelection from "../Signup/AppModeSelection";
import { Box, Spinner, useDisclosure } from "@chakra-ui/react";
import { runInAction } from "mobx";
import { useStore } from "../../store/store";
import { useToastNotifications } from "../../firebase/messaging";
import Header from "../../components/Header";
import React from "react";
import CancelRegistrationDialog from "../../components/CancelRegistrationDialog";

export const ProtectedRoute = observer(() => {
  const {
    auth,
    registration,
    user: { user: userData },
  } = useStore();

  if (!registration.isFinished && registration.isInProgress) {
    return <Navigate to="/signup" replace />;
  }

  // Firebase auth logged in + user data received from mongodb database
  return auth.loggedIn && userData ? <Outlet /> : <Navigate to="/splash" replace />;
});

export const LoginRouteHandler = observer(() => {
  const { auth, user } = useStore();

  if (user.exists && auth.loggedIn) {
    return <Navigate replace to="/" />;
  }

  return <Login />;
});

export const RegRouteHandler = observer(() => {
  const { registration, auth, user } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { step } = useParams<{ step: Step }>();

  React.useEffect(() => {
    runInAction(() => {
      if (step) {
        registration.step = step;
      }
    });
  }, [step, registration]);

  if (user.exists && auth.loggedIn) {
    return <Navigate replace to="/" />;
  }

  if (!step) {
    const curStep = registration.step;
    return <Navigate replace to={`/signup/${curStep}`} />;
  }

  const previousStep = registration.getPreviousStep(step);
  const currentStep = registration.getStep(step);
  const nextStep = registration.getNextStep(step);

  if (currentStep?.done && nextStep && !nextStep?.goBack) {
    return <Navigate replace to={`/signup/${registration.step}`} />;
  }

  if (!registration.canStep(currentStep?.step as Step)) {
    const firstUnfinishedStep = registration.getFirstUnfinishedStep();
    return <Navigate replace to={`/signup/${firstUnfinishedStep?.step}`} />;
  }

  let StepComponent;
  switch (step) {
    case "email":
      StepComponent = EmailRegistration;
      break;
    case "phone":
      StepComponent = PhoneNumber;
      break;
    case "name":
      StepComponent = Name;
      break;
    case "birthdate":
      StepComponent = Birthdate;
      break;
    case "gender":
      StepComponent = GenderSelection;
      break;
    case "mode":
      StepComponent = AppModeSelection;
      break;
    case "showme":
      StepComponent = ShowMeSelection;
      break;
    case "pssd-duration":
      StepComponent = PSSDDurationSelection;
      break;
    case "photos":
      StepComponent = AddPhotos;
      break;
    case "location":
      StepComponent = AllowLocation;
      break;
    case "notification":
      StepComponent = AllowNotifications;
      break;
  }

  return (
    <Box>
      <Header
        onCancel={onOpen}
        path={currentStep?.goBack ? previousStep?.step ?? "/" : undefined}
        close={currentStep?.cancelable}
        hr={false}
      />
      <Box>
        <StepComponent />
      </Box>
      <CancelRegistrationDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
});

const App = observer(() => {
  const { auth, user } = useStore();
  useToastNotifications();

  if (!auth.isReady || !user.isInitialized || auth.isLoggingIn) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<Home />} />
      </Route>
      <Route path="/splash" element={<Entry />} />
      <Route path="/login" element={<LoginRouteHandler />} />
      <Route path="/signup" element={<RegRouteHandler />}>
        <Route path=":step" element={<EmailRegistration />} />
      </Route>
    </Routes>
  );
});

export default App;
