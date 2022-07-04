import * as Yup from "yup"
import { useFormik } from "formik"
import { useMutation } from "react-query"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Box,
  VStack,
  Button,
  Spinner,
  HStack,
  Select,
  BoxProps,
  FormHelperText,
  ButtonProps,
} from "@chakra-ui/react"

const FormBuilder = ({
  fields,
  mutation,
  onError,
  onSuccess,
  button,
  ...props
}: FormBuilderProps) => {
  const values: any = {}
  const validationRules: { [key: string]: Yup.AnySchema } = {}
  Object.keys(fields).map((key) => {
    values[key] = fields[key].initialValue ? fields[key].initialValue : ""
    validationRules[key] = fields[key].validate
  })
  const { mutateAsync, isLoading } = useMutation(mutation, {
    onSuccess,
    onError,
    // onMutate: async () => {},
  })
  const {
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    setFieldValue,
    values: formikValues,
  } = useFormik({
    initialValues: values,
    validationSchema: Yup.object().shape(validationRules),
    onSubmit: async (values) => {
      await mutateAsync(values)
    },
  })
  return (
    <Box {...props}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          {Object.keys(fields).map((key) => {
            return (
              <FormControl
                isInvalid={touched[key] && (errors[key] ? true : false)}
              >
                <FormLabel>{fields[key].label}</FormLabel>
                {fields[key].type === "select" ? (
                  <Select {...getFieldProps(key)}>
                    {fields[key].options?.map(([item, value]) => {
                      return <option value={value}>{item}</option>
                    })}
                  </Select>
                ) : (
                  <Input
                    type={fields[key].type}
                    {...getFieldProps(key)}
                    disabled={!!fields[key].disabled}
                  />
                )}
                {fields[key].helperText && (
                  <FormHelperText>{fields[key].helperText}</FormHelperText>
                )}
                <FormErrorMessage>{errors[key] as string}</FormErrorMessage>
              </FormControl>
            )
          })}
        </VStack>
        <Button
          type="submit"
          disabled={isLoading}
          mt="6"
          w="full"
          variant={button.variant ?? "solid"}
          colorScheme={button.colorScheme ?? "blue"}
        >
          <HStack spacing="2">
            {isLoading && <Spinner color="white" size="sm" />}
            <span>{isLoading ? button.loadingLabel : button.label}</span>
          </HStack>
        </Button>
      </form>
    </Box>
  )
}

export default FormBuilder

interface FormButton extends ButtonProps {
  label: string
  loadingLabel: string
}

interface FormBuilderProps extends BoxProps {
  className?: string
  fields: {
    [key: string]: {
      type: string
      label: string
      initialValue?: string
      validate: Yup.AnySchema
      value?: any
      options?: [string, string][]
      helperText?: string
      disabled?: boolean
    }
  }
  mutation: any
  onSuccess: (value: any) => void
  onError: (err: any) => void
  button: FormButton
}
