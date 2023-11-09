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
import * as Yup from "yup";
import { FormikSubmit } from "../types/formik";

const GenderSelectionSchema = Yup.object().shape({
  gender: Yup.string(),
});

export type GenderSelectionFormValues = {
  gender: string;
};

export type GenderSelectionPayload = GenderSelectionFormValues & FormikSubmit;

const GenderSelectionForm = (props: FormikProps<GenderSelectionFormValues>) => {
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
          <FormControl isInvalid={Boolean(errors.gender && touched.gender)}>
            <RadioGroup name="gender" value={values.gender}>
              <Stack>
                <Radio onChange={handleChange} value="man">
                  <Text fontSize="lg">Man</Text>
                </Radio>
                <Radio onChange={handleChange} value="woman">
                  <Text fontSize="lg">Woman</Text>
                </Radio>
                <Radio onChange={handleChange} value="other">
                  <Text fontSize="lg">Other</Text>
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

const FormikGenderSelectionForm = observer(
  withFormik<
    { onSubmit: (payload: GenderSelectionPayload) => void },
    GenderSelectionFormValues
  >({
    mapPropsToValues: () => ({
      gender: "man",
    }),

    validationSchema: GenderSelectionSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { gender: GenderSelection } = values;

      props.onSubmit({ gender: GenderSelection, setSubmitting });
    },

    displayName: "GenderSelectionForm",
  })(GenderSelectionForm)
);

export default FormikGenderSelectionForm;
