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
import { FormikSubmit } from "../types/formik";

const EmailRegistrationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\?])(?=.{6,})/,
      "Password must contain at least 6 characters, one uppercase, one number and one special case character"
    )
    .required("Required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export type EmailRegistrationFormValues = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type EmailRegistrationPayload = EmailRegistrationFormValues & FormikSubmit;

const EmailRegistrationForm = (props: FormikProps<EmailRegistrationFormValues>) => {
  const {
    touched,
    errors,
    values,
    handleSubmit,
    isSubmitting,
    isValid,
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
          <FormControl
            isInvalid={Boolean(
              errors.passwordConfirmation && touched.passwordConfirmation
            )}
          >
            <FormLabel>Confirm your password</FormLabel>
            <Input
              name="passwordConfirmation"
              placeholder="Enter your password again"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.passwordConfirmation}
            />
            <FormErrorMessage>{errors.passwordConfirmation}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="green"
            size="lg"
            isDisabled={!isValid}
            isLoading={isSubmitting}
            type="submit"
          >
            CONTINUE
          </Button>
        </VStack>
      </Form>
    </Box>
  );
};

const FormikEmailRegistrationForm = observer(
  withFormik<
    { onSubmit: (payload: EmailRegistrationPayload) => void },
    EmailRegistrationFormValues
  >({
    mapPropsToValues: () => ({
      email: "",
      password: "",
      passwordConfirmation: "",
    }),
    validationSchema: EmailRegistrationSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { email, password, passwordConfirmation } = values;

      props.onSubmit({ email, password, passwordConfirmation, setSubmitting });
    },

    displayName: "EmailRegistrationForm",
  })(EmailRegistrationForm)
);

export default FormikEmailRegistrationForm;
