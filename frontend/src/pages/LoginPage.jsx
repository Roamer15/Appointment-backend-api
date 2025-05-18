import LoginForm from "../components/auth/login/LoginForm"
import { useState } from "react";
import { useFormik } from "formik";
import api from "../services/api";
import { useNavigate } from "react-router";
import { validationSchema } from "../schema/validationSchema";

export default function LoginPage() {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('')
    const navigate = useNavigate()
  
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });

      const formik = useFormik({
          initialValues: {
            email: '',
            password: '',
          },
          validationSchema,
          onSubmit: async (values) => {
            setError('');
            try {
              const formData = new FormData();
              formData.append('email', values.email);
              formData.append('password', values.password);
              for (const [key, value] of formData.entries()) {
                  console.log(`${key}:`, value);
                }
              const res = await api.login(formData)
      
              if (!res.ok) throw new Error(res.message);
              console.log('Login successfull!');
              navigate("/dashboard");
              formik.resetForm();
            } catch (err) {
              setError(err.message || 'Login failed');
            }
          },
        });
      
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login form submitted', formData);
        setShowModal(true);
      };
    return(
        <LoginForm formik={formik} handleChange={handleChange} handleSubmit={handleSubmit} showModal={showModal} setShowModal={setShowModal} error={error}/>
    )
}