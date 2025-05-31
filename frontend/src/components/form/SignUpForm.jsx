import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../../style/Form.css";

const SignUpForm = ({ onSignUpComplete }) => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    role: Yup.string().oneOf(["admin", "user"]).required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      setStatus({ success: response.data.message });
      resetForm();
      if (onSignUpComplete) {
        onSignUpComplete(); // Call parent to switch to SignIn
      }
    } catch (error) {
      setStatus({
        error: error.response?.data?.error || "Registration failed",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="form-box">
      <h2>Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <Field id="name" name="name" type="text" />
            <ErrorMessage name="name" component="div" className="error-message" />

            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <Field id="email" name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error-message" />

            <label htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <Field as="select" name="role" id="role">
              <option value="" disabled>-- Select Role --</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Field>
            <ErrorMessage name="role" component="div" className="error-message" />

            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <Field id="password" name="password" type="password" />
            <ErrorMessage name="password" component="div" className="error-message" />

            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <Field id="confirmPassword" name="confirmPassword" type="password" />
            <ErrorMessage name="confirmPassword" component="div" className="error-message" />

            <input
              type="submit"
              disabled={isSubmitting}
              value={isSubmitting ? "Registering..." : "Sign Up"}
            />

            {status?.error && <div className="error-message">{status.error}</div>}
            {status?.success && (
              <div style={{ color: "green", marginTop: "1rem" }}>{status.success}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpForm;
