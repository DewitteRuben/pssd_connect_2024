import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  Box,
} from "@chakra-ui/react";
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import * as Yup from "yup";
import { AuthStore, AuthStoreContext } from "../store/auth";
import React from "react";
import { NavigateFunction } from "react-router-dom";
import { FormikSubmit } from "../types/formik";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = (props: FormikProps<LoginFormValues>) => {
  const {
    touched,
    errors,
    values,
    handleSubmit,
    isSubmitting,
    handleChange,
    handleBlur,
  } = props;

  return (
    <Box width="100%">
      <Form onSubmit={handleSubmit}>
        <VStack spacing={6} alignItems="start">
          <FormControl isInvalid={Boolean(errors.email && touched.email)}>
            <FormLabel>Email Address</FormLabel>
            <Input
              name="email"
              placeholder="Email address"
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
              placeholder="Password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <Button colorScheme="green" size="lg" isLoading={isSubmitting} type="submit">
            Login
          </Button>
        </VStack>
      </Form>
    </Box>
  );
};

export type LoginFormPayload = LoginFormValues & FormikSubmit;

const FormikLoginForm = observer(
  withFormik<{ onSubmit: (payload: LoginFormPayload) => void }, LoginFormValues>({
    mapPropsToValues: () => ({ email: "", password: "" }),
    validationSchema: LoginSchema,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { email, password } = values;

      props.onSubmit({ email, password, setSubmitting });
    },

    displayName: "LoginForm",
  })(LoginForm)
);

export default FormikLoginForm;
