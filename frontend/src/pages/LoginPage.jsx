import LoginForm from "../components/auth/login/LoginForm";
import { useState } from "react";
import { useFormik } from "formik";
import api from "../services/api";
import { useNavigate } from "react-router";
import { loginValidationSchema } from "../schema/validationSchema";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    loginValidationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        const data = await api.login({
          email: values.email,
          password: values.password,
        });

        if (!data || !data.token) throw new Error("Invalid login response");

        localStorage.setItem("token", data.token);
        toast.success("Login successful");
        navigate("/dashboard");
        console.log("Login successfull!");
        formik.resetForm();
      } catch (err) {
        toast.error("Login Failed");
        setError(err.message || "Login failed");
      }
    },
  });
  return (
    <LoginForm
      formik={formik}
      showModal={showModal}
      setShowModal={setShowModal}
      error={error}
    />
  );
}
