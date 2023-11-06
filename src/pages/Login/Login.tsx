import { Box } from "@chakra-ui/react"
import FormikLoginForm from "../../components/LoginForm"
import { observer } from "mobx-react"
import { AuthStoreContext } from "../../store/auth";
import React from "react";

const Login = observer(() => {
    const auth = React.useContext(AuthStoreContext);

    return (<Box>
        <FormikLoginForm auth={auth}></FormikLoginForm>
    </Box>)
})

export default Login