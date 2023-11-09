import {
  FormControl,
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
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import differenceInYears from "date-fns/differenceInYears";

const BirthdateSchema = Yup.object().shape({
  birthdate: Yup.date()
    .required("Your birthdate is required")
    .test("ageCheck", "You must be 18 or older in order to use this app", (value) => {
      console.log("test");
      return differenceInYears(new Date(), new Date(value)) >= 18;
    }),
});

export type BirthdateFormValues = {
  birthdate: Date;
};

export type BirthdatePayload = BirthdateFormValues & FormikSubmit;

const BirthdateForm = (props: FormikProps<BirthdateFormValues>) => {
  const { errors, values, handleSubmit, isSubmitting, isValid, setFieldValue } = props;

  const onDateChange = (date: Date) => {
    setFieldValue("birthdate", date);
  };

  console.log(Boolean(errors.birthdate));

  console.log(typeof errors.birthdate);
  console.log(errors.birthdate);
  return (
    <Box width="100%">
      <Form onSubmit={handleSubmit}>
        <VStack spacing={6} alignItems="start">
          <FormControl isInvalid={Boolean(errors.birthdate)}>
            <SingleDatepicker
              name="birthdate"
              date={values.birthdate}
              onDateChange={onDateChange}
            />

            {Boolean(errors.birthdate) ? (
              <FormErrorMessage>{errors.birthdate as string}</FormErrorMessage>
            ) : (
              <FormHelperText>Your age will be public.</FormHelperText>
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

const FormikBirthdateForm = observer(
  withFormik<{ onSubmit: (payload: BirthdatePayload) => void }, BirthdateFormValues>({
    mapPropsToValues: () => ({
      birthdate: new Date("2000-01-01"),
    }),
    validationSchema: BirthdateSchema,
    validateOnMount: true,

    handleSubmit: async (values, { props, setSubmitting }) => {
      const { birthdate: Birthdate } = values;

      props.onSubmit({ birthdate: Birthdate, setSubmitting });
    },

    displayName: "BirthdateForm",
  })(BirthdateForm)
);

export default FormikBirthdateForm;
