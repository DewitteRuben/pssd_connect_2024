import * as Yup from "yup";
import {
  FormControl,
  Button,
  VStack,
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, FormikProps, withFormik } from "formik";
import { observer } from "mobx-react";
import { FormikSubmit } from "../types/formik";

const AppModeSelectionSchema = Yup.object().shape({
  mode: Yup.string(),
});

export type AppModeSelectionFormValues = {
  mode: string;
};

export type AppModeSelectionPayload = AppModeSelectionFormValues & FormikSubmit;

const AppModeSelectionForm = (props: FormikProps<AppModeSelectionFormValues>) => {
  const { errors, values, touched, handleSubmit, isSubmitting, isValid, handleChange } =
    props;

  return (
    <Box width="100%">
      <Form onSubmit={handleSubmit}>
        <VStack spacing={6} alignItems="start">
          <FormControl isInvalid={Boolean(errors.mode && touched.mode)}>
            <RadioGroup name="mode" value={values.mode}>
              <Stack>
                <Radio onChange={handleChange} value="dating">
                  {/* TODO: Add extra info about modes, and add cards */}
                  <Text fontSize="lg">Dating mode</Text>
                </Radio>
                <Radio onChange={handleChange} value="friends">
                  <Text fontSize="lg">Friends mode</Text>
                </Radio>
              </Stack>
            </RadioGroup>
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

const FormikAppModeSelectionForm = observer(
  withFormik<
    {
      onSubmit: (payload: AppModeSelectionPayload) => void;
      initialValues: { mode: string };
    },
    AppModeSelectionFormValues
  >({
    mapPropsToValues: ({ initialValues }) => ({
      mode: initialValues.mode,
    }),

    validationSchema: AppModeSelectionSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { mode: AppModeSelection } = values;

      props.onSubmit({ mode: AppModeSelection, setSubmitting });
    },

    displayName: "AppModeSelectionForm",
  })(AppModeSelectionForm)
);

export default FormikAppModeSelectionForm;
