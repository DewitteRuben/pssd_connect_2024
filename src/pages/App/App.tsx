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
import { Box, Spinner } from "@chakra-ui/react";
import { runInAction } from "mobx";
import { useStore } from "../../store/store";
import { useToastNotifications } from "../../firebase/messaging";

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

export const RegRouteHandler = observer(() => {
  const { registration, auth, user } = useStore();

  const { step } = useParams<{ step: Step }>();

  if (user.exists && auth.loggedIn) {
    return <Navigate replace to="/" />;
  }

  if (!step) {
    const curStep = registration.step;
    return <Navigate replace to={`/signup/${curStep}`} />;
  }

  const requestedStep = registration.getStep(step);
  if (requestedStep?.done && !requestedStep?.goBack) {
    return <Navigate replace to={`/signup/${registration.step}`}></Navigate>;
  }

  if (!registration.canStep(requestedStep?.step as Step)) {
    const firstUnfinishedStep = registration.getFirstUnfinishedStep();
    return <Navigate replace to={`/signup/${firstUnfinishedStep?.step}`} />;
  }

  runInAction(() => {
    registration.step = step;
  });

  switch (step) {
    case "email":
      return <EmailRegistration />;
    case "phone":
      return <PhoneNumber />;
    case "name":
      return <Name />;
    case "birthdate":
      return <Birthdate />;
    case "gender":
      return <GenderSelection />;
    case "mode":
      return <AppModeSelection />;
    case "showme":
      return <ShowMeSelection />;
    case "pssd-duration":
      return <PSSDDurationSelection />;
    case "photos":
      return <AddPhotos />;
    case "location":
      return <AllowLocation />;
    case "notification":
      return <AllowNotifications />;
  }
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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<RegRouteHandler />}>
        <Route path=":step" element={<EmailRegistration />} />
      </Route>
    </Routes>
  );
});

export default App;
