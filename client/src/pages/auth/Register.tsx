import axios from "axios"
import * as Yup from "yup"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"

/**
 * Import Components / Utilities
 */
import showErrorToasts from "@/utils/showErrorToasts"
import AuthContainer from "@/components/AuthContainer"
import { FormControl, Input, ErrorMessage, Label } from "@/components/Form"

/**
 * Yup validation schema for register form
 */
const reigsterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),
  username: Yup.string()
    .trim()
    .required("University ID is required")
    .length(7, "Invalid University ID"),
  password: Yup.string().trim().required("Password is required"),
})

/**
 * Component for registration page
 */
const Register = (): JSX.Element => {
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: reigsterSchema,
    onSubmit: async (values) => {
      try {
        /**
         * TODO: REPLACE THIS WITH REACT-QUERY MUTATION
         */
        await axios.post("/api/auth/register", values)
        // redirect to the login page
        navigate("/login")
        // create a toast
        toast.success("Account created!")
      } catch (err: any) {
        const { data, status, statusText } = err.response
        // handle bad gateway errors
        if (status === 502) toast.error(statusText)
        showErrorToasts(data.message)
      }
    },
  })

  return (
    <AuthContainer>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="space-y-3">
        <h2>Create New Account</h2>
        <p>
          Already have an account?
          <Link to="/login" className="ml-1 text-primary">
            Login
          </Link>
        </p>
      </div>
      <form className="mt-8" onSubmit={formik.handleSubmit}>
        <div className="space-y-4">
          <FormControl isInvalid={formik.touched.name && formik.errors.name}>
            <Label>Name</Label>
            <Input type="text" {...formik.getFieldProps("name")} />
            <ErrorMessage>{formik.errors.name}</ErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.touched.email && formik.errors.email}>
            <Label>Email</Label>
            <Input type="email" {...formik.getFieldProps("email")} />
            <ErrorMessage>{formik.errors.email}</ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.touched.username && formik.errors.username}
          >
            <Label>University ID</Label>

            <Input type="text" {...formik.getFieldProps("username")} />
            <ErrorMessage>{formik.errors.username}</ErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.touched.password && formik.errors.password}
          >
            <Label>Password</Label>

            <Input type="password" {...formik.getFieldProps("password")} />
            <ErrorMessage>{formik.errors.password}</ErrorMessage>
          </FormControl>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-sm">
            By clicking below to signup, you're agreeing to our terms of
            service.
          </p>
          <button type="submit" className="block w-full btn-primary">
            Register
          </button>
        </div>
      </form>
    </AuthContainer>
  )
}

export default Register
