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

const PSSDDurationSelectionSchema = Yup.object().shape({
  duration: Yup.string(),
});

export type PSSDDurationSelectionFormValues = {
  duration: string;
};

export type PSSDDurationSelectionPayload = PSSDDurationSelectionFormValues & FormikSubmit;

const PSSDDurationSelectionForm = (props: FormikProps<PSSDDurationSelectionFormValues>) => {
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    isValid,
    handleBlur,
    handleChange,
  } = props;

  return (
    <Box width="100%">
      <Form onSubmit={handleSubmit}>
        <VStack spacing={6} alignItems="start">
          <FormControl isInvalid={Boolean(errors.duration && touched.duration)}>
            <RadioGroup name="duration" value={values.duration}>
              <Stack>
                <Radio onChange={handleChange} value="3to6months">
                  <Text fontSize="lg">3 – 6 months</Text>
                </Radio>
                <Radio onChange={handleChange} value="6to12months">
                  <Text fontSize="lg">6 – 12 months</Text>
                </Radio>
                <Radio onChange={handleChange} value="1to2years">
                  <Text fontSize="lg">1 – 2 years</Text>
                </Radio>
                <Radio onChange={handleChange} value="3to5years">
                  <Text fontSize="lg">3 – 5 years</Text>
                </Radio>
                <Radio onChange={handleChange} value="5to10years">
                  <Text fontSize="lg">5 – 10 years</Text>
                </Radio>
                <Radio onChange={handleChange} value="morethan10years">
                  <Text fontSize="lg">10+ years</Text>
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

const FormikPSSDDurationSelectionForm = observer(
  withFormik<
    { onSubmit: (payload: PSSDDurationSelectionPayload) => void },
    PSSDDurationSelectionFormValues
  >({
    mapPropsToValues: () => ({
      duration: "6to12months",
    }),

    validationSchema: PSSDDurationSelectionSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { duration } = values;

      props.onSubmit({ duration, setSubmitting });
    },

    displayName: "PSSDDurationSelectionForm",
  })(PSSDDurationSelectionForm)
);

export default FormikPSSDDurationSelectionForm;
