import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "../Login/Login";
import { observer } from "mobx-react";
import React from "react";
import { AuthStoreContext } from "../../store/auth";
import Home from "../Home/Home";

export const ProtectedRoute = observer(() => {
    const auth = React.useContext(AuthStoreContext);

    return auth.loggedIn ? <Outlet /> : <Navigate to="/login" replace />
});

const App = observer(() => {
    const auth = React.useContext(AuthStoreContext);
    if (!auth.isReady) {
        return <div>Loading...</div>
    }

    return (<Routes>
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
    </Routes>)
})

export default App