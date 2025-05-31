import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../../style/Form.css";

const SignInForm = ({ onLoginSuccess }) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: values.email,
        password: values.password,
      });
      setStatus({ success: response.data.message });
      if (onLoginSuccess) {
        onLoginSuccess(response.data); // Pass token and user info
      }
    } catch (error) {
      setStatus({ error: error.response?.data?.error || "Login failed" });
    }
    setSubmitting(false);
  };

  return (
    <div className="form-box">
      <h2>Sign In</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <label htmlFor="email">Email <span className="required">*</span></label>
            <Field id="email" name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error-message" />

            <label htmlFor="password">Password <span className="required">*</span></label>
            <Field id="password" name="password" type="password" />
            <ErrorMessage name="password" component="div" className="error-message" />

            <input
              type="submit"
              disabled={isSubmitting}
              value={isSubmitting ? "Signing In..." : "Sign In"}
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

export default SignInForm;
