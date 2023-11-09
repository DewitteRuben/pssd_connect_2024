import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import * as Yup from "yup";
import { FormikSubmit } from "../types/formik";
import countries from "../assets/countries.json";
import { AuthStoreContext } from "../store/auth";
import React from "react";

const PhoneNumberSchema = Yup.object().shape({
  country_code: Yup.string(),
  phone_number: Yup.string().required("Phone number is required"),
});

export type PhoneNumberFormValues = {
  country_code: string;
  phone_number: string;
  verification_code: string;
};

const PhoneNumberForm = (props: FormikProps<PhoneNumberFormValues>) => {
  const {
    touched,
    errors,
    values,
    handleSubmit,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    isValid,
  } = props;

  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationSuccess, setVerificationSuccess] = React.useState(false);
  const toast = useToast();

  const auth = React.useContext(AuthStoreContext);

  const onPhoneNumberChange = (e: any) => {
    e.preventDefault();
    const { value } = e.target;
    const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
    if (!value || /\s/.test(value.toString()) || regex.test(value.toString())) {
      setFieldValue("phone_number", value.toString().split(/\s+/).join(""));
    }
  };

  const onVerification = async () => {
    const isInvalid = Boolean(errors.verification_code && touched.verification_code);

    if (!auth.hasConfirmationResult) {
      throw new Error("invalid state: no confirmation result");
    }

    if (isInvalid) return;

    setIsVerifying(true);

    const { success, message } = await auth.confirmVerification(values.verification_code);
    console.log({ success, message });

    if (!success) {
      toast({
        title: "Failed to verify code",
        description: message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setVerificationSuccess(success);
    setIsVerifying(false);
  };

  const onSendCode = async () => {
    const isInvalid =
      Boolean(errors.phone_number && touched.phone_number) ||
      Boolean(errors.verification_code && touched.verification_code);

    if (isInvalid) return;

    setIsSendingCode(true);

    const { success, message } = await auth.verifyPhoneNumber(
      values.country_code,
      values.phone_number
    );

    if (!success) {
      toast({
        title: "Failed to send verification code",
        description: message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setIsSendingCode(false);
  };

  return (
    <Box width="100%">
      <Form onSubmit={handleSubmit}>
        <VStack spacing={6} alignItems="start">
          {!auth.hasConfirmationResult && !verificationSuccess && (
            <>
              <Box display="flex">
                <Select
                  width="150px"
                  marginRight={4}
                  name="country_code"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.country_code}
                >
                  {countries.map(({ code, dial_code, name }) => (
                    <option key={code} value={dial_code}>
                      {dial_code}
                    </option>
                  ))}
                </Select>
                <FormControl
                  isInvalid={Boolean(errors.phone_number && touched.phone_number)}
                >
                  <Input
                    type="tel"
                    name="phone_number"
                    isDisabled={isSendingCode}
                    placeholder="Phone number"
                    onChange={onPhoneNumberChange}
                    onBlur={handleBlur}
                    value={values.phone_number}
                  />
                  <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
                </FormControl>
              </Box>
              <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
              <Button
                onClick={onSendCode}
                isDisabled={!isValid || isSendingCode}
                isLoading={isSendingCode}
                colorScheme="green"
                size="lg"
              >
                SEND CODE
              </Button>
            </>
          )}

          {auth.hasConfirmationResult && (
            <>
              <FormControl
                isInvalid={Boolean(errors.verification_code && touched.verification_code)}
              >
                <FormLabel>Enter verification code</FormLabel>
                <Input
                  type="text"
                  name="verification_code"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.verification_code}
                />

                <FormErrorMessage>{errors.verification_code}</FormErrorMessage>
              </FormControl>
              <Button
                colorScheme="green"
                isLoading={isVerifying}
                size="lg"
                onClick={onVerification}
              >
                VERIFY
              </Button>
            </>
          )}

          {verificationSuccess && (
            <Box>
              <Text size="lg">You've successfully verified your phone number!</Text>
            </Box>
          )}

          <Button
            colorScheme="green"
            size="lg"
            isDisabled={!verificationSuccess}
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

export type PhoneNumberFormPayload = PhoneNumberFormValues & FormikSubmit;

const FormikPhoneNumberForm = withFormik<
  { onSubmit: (payload: PhoneNumberFormPayload) => void },
  PhoneNumberFormValues
>({
  mapPropsToValues: () => ({
    country_code: "+1",
    phone_number: "",
    verification_code: "",
  }),
  validationSchema: PhoneNumberSchema,
  validateOnMount: true,

  handleSubmit: async (values, { props, setSubmitting }) => {
    const { phone_number, country_code, verification_code } = values;

    props.onSubmit({ phone_number, country_code, setSubmitting, verification_code });
  },

  displayName: "PhoneNumberForm",
})(observer(PhoneNumberForm));

export default FormikPhoneNumberForm;
