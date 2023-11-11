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

const PrefGenderSchema = Yup.object().shape({
  prefGender: Yup.string(),
});

export type PrefGenderFormValues = {
  prefGender: string;
};

export type PrefGenderPayload = PrefGenderFormValues & FormikSubmit;

const PrefGenderForm = (props: FormikProps<PrefGenderFormValues>) => {
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
          <FormControl isInvalid={Boolean(errors.prefGender && touched.prefGender)}>
            <RadioGroup name="prefGender" value={values.prefGender}>
              <Stack>
                <Radio onChange={handleChange} value="men">
                  <Text fontSize="lg">Men</Text>
                </Radio>
                <Radio onChange={handleChange} value="women">
                  <Text fontSize="lg">Women</Text>
                </Radio>
                <Radio onChange={handleChange} value="everyone">
                  <Text fontSize="lg">Everyone</Text>
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

const FormikPrefGenderForm = observer(
  withFormik<
    {
      onSubmit: (payload: PrefGenderPayload) => void;
      initialValues: { prefGender: string };
    },
    PrefGenderFormValues
  >({
    mapPropsToValues: ({ initialValues }) => ({
      prefGender: initialValues.prefGender,
    }),

    validationSchema: PrefGenderSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { prefGender: PrefGender } = values;

      props.onSubmit({ prefGender: PrefGender, setSubmitting });
    },

    displayName: "PrefGenderForm",
  })(PrefGenderForm)
);

export default FormikPrefGenderForm;
