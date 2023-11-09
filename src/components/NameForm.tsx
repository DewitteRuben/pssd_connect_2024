import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  FormHelperText,
} from "@chakra-ui/react";
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import * as Yup from "yup";
import { FormikSubmit } from "../types/formik";

const NameSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
});

export type NameFormValues = {
  name: string;
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
          <FormControl isInvalid={Boolean(errors.name && touched.name)}>
            <Input
              name="name"
              placeholder="First name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />

            {Boolean(errors.name && touched.name) ? (
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            ) : (
              <FormHelperText>
                This is how it will appear on PSSD Social.
              </FormHelperText>
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
  withFormik<{ onSubmit: (payload: NamePayload) => void }, NameFormValues>({
    mapPropsToValues: () => ({
      name: "",
    }),
    validationSchema: NameSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { name } = values;

      props.onSubmit({ name, setSubmitting });
    },

    displayName: "NameForm",
  })(NameForm)
);

export default FormikNameForm;
