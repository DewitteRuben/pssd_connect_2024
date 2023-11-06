import { FormControl, FormLabel, Input, FormErrorMessage, Button } from "@chakra-ui/react"
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import * as Yup from 'yup';
import { AuthStore, AuthStoreContext } from "../store/auth";
import React from "react";


const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

export type LoginFormValues = {
    email: string;
    password: string;
}

const LoginForm = (props: FormikProps<LoginFormValues>) => {
    const {
        touched,
        errors,
        values,
        handleSubmit,
        isSubmitting,
        handleChange,
        handleBlur
    } = props;

    return (<Form onSubmit={handleSubmit}>
        <FormControl isInvalid={Boolean(errors.email && touched.email)}>
            <FormLabel>Email Address</FormLabel>
            <Input
                name="email"
                placeholder='Email address'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.password && touched.password)}>
            <FormLabel>Password</FormLabel>
            <Input
                name="password"
                placeholder='Password'
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <Button
            mt={4}
            colorScheme='teal'

            isLoading={isSubmitting}
            type='submit'
        >
            Submit
        </Button>
    </Form>)
}

const FormikLoginForm = observer(withFormik<{ auth: AuthStore }, LoginFormValues>({
    mapPropsToValues: () => ({ email: '', password: '' }),
    validationSchema: SignupSchema,

    handleSubmit: async (values, { props, setSubmitting }) => {
        const { auth } = props
        const { email, password } = values
        try {

            await auth.signIn(email, password)
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }


    },

    displayName: 'LoginForm',
})(LoginForm));

export default FormikLoginForm