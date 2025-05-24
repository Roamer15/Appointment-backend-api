import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import RegisterForm from "../components/auth/register/RegisterForm";
import Spinner from "../components/Spinner";
import api from "../services/api";
import { validationSchema } from "../schema/validationSchema";
import { compressImage, isValidImage } from "../utils/imageUtils";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
      terms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setError("");
      setIsLoading(true);
      try {
        const formData = new FormData();
        const [firstName, ...lastParts] = values.fullName.trim().split(" ");
        const lastName = lastParts.join(" ") || "-";

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("role", values.role);
        if (file instanceof File) {
          formData.append("profilePic", file);
        }

        const res = await api.register(formData);
        if (res.error) throw new Error(res.error);
        toast.success("Account created succcesfully");
        console.log(values.role);
        if (values.role === "provider") {
          navigate("/register-provider", {
            state: {
              userId: res.userId,
              email: values.email,
            },
          });
        } else {
          navigate("/email-verification", { state: { email: values.email } });
        }
        formik.resetForm();
        setPreview(null);
        setFile(null);
      } catch (err) {
        console.error("Registration error:", err);
        setError(err.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!isValidImage(selected)) {
      toast.error("Only JPEG, PNG, JPG or GIF allowed");
      return;
    }

    try {
      const compressed = await compressImage(selected);
      setFile(compressed);
      const blobUrl = URL.createObjectURL(compressed);
      setPreview(blobUrl);
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Failed to compress image. Try another one.");
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <>
      {isLoading && <Spinner />}
      <RegisterForm
        preview={preview}
        handleImageChange={handleImageChange}
        error={error}
        formik={formik}
      />
    </>
  );
}
