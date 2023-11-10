import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "../Login/Login";
import { observer } from "mobx-react";
import React from "react";
import { AuthStoreContext } from "../../store/auth";
import Home from "../Home/Home";
import Entry from "../Entry/Entry";
import EmailRegistration from "../Signup/EmailRegistration";
import { RegistrationStoreContext } from "../../store/registration";
import PhoneNumber from "../Signup/PhoneNumber";
import Name from "../Signup/Name";
import Birthdate from "../Signup/Birthdate";
import GenderSelection from "../Signup/GenderSelection";
import ShowMeSelection from "../Signup/ShowMeSelection";
import PSSDDurationSelection from "../Signup/PSSDDurationSelection";
import AddPhotos from "../Signup/AddPhotos";
import AllowLocation from "../Signup/AllowLocation";
import AppModeSelection from "../Signup/AppModeSelection";

export const ProtectedRoute = observer(() => {
  const auth = React.useContext(AuthStoreContext);

  return auth.loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
});

const App = observer(() => {
  const auth = React.useContext(AuthStoreContext);
  const registration = React.useContext(RegistrationStoreContext);

  if (!auth.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/entry" element={<Entry />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/signup"
        element={
          <>
            <Navigate to={registration.step} />
            <Outlet></Outlet>
          </>
        }
      >
        <Route path="email" element={<EmailRegistration />} />
        <Route path="phone" element={<PhoneNumber />} />
        <Route path="name" element={<Name />} />
        <Route path="birthdate" element={<Birthdate />} />
        <Route path="gender" element={<GenderSelection />} />
        <Route path="mode" element={<AppModeSelection />} />
        <Route path="showme" element={<ShowMeSelection />} />
        <Route path="pssd-duration" element={<PSSDDurationSelection />} />
        <Route path="photos" element={<AddPhotos />} />
        <Route path="location" element={<AllowLocation />} />
      </Route>
    </Routes>
  );
});

export default App;
