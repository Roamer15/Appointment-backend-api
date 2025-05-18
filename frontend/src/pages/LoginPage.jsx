import LoginForm from "../components/auth/login/LoginForm"
import { useState } from "react";

export default function LoginPage() {
    const [showModal, setShowModal] = useState(false);
  
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
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
        <LoginForm handleChange={handleChange} handleSubmit={handleSubmit} showModal={showModal} setShowModal={setShowModal} formData={formData} />
    )
}