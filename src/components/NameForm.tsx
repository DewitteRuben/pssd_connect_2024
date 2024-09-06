import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import * as Yup from "yup";
import { FormikSubmit } from "../types/formik";

const NameSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("Required"),
});

export type NameFormValues = {
  firstName: string;
};

export type NamePayload = NameFormValues & FormikSubmit;

const NameForm = (props: FormikProps<NameFormValues>) => {
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
          <Text fontSize="sm">You won't be able to change this later.</Text>
          <FormControl isInvalid={Boolean(errors.firstName && touched.firstName)}>
            <Input
              name="firstName"
              placeholder="Add your first name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
            />

            {Boolean(errors.firstName && touched.firstName) && (
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            )}
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

const FormikNameForm = observer(
  withFormik<
    { onSubmit: (payload: NamePayload) => void; initialValues: { firstName: string } },
    NameFormValues
  >({
    mapPropsToValues: ({ initialValues }) => ({
      firstName: initialValues.firstName,
    }),
    validationSchema: NameSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { firstName } = values;

      props.onSubmit({ firstName, setSubmitting });
    },

    displayName: "NameForm",
  })(NameForm)
);

export default FormikNameForm;
