import { useState } from 'react';
import RegisterForm from '../components/auth/register/RegisterForm'
import { useFormik } from 'formik';
import { validationSchema } from '../schema/validationSchema';
import api from '../services/api';
import imageCompression from 'browser-image-compression';

export default function RegisterPage() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'client',
      terms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        const formData = new FormData();
        const [firstName, ...lastParts] = values.fullName.split(' ');
        const lastName = lastParts.join(' ') || '-';
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('role', values.role);
        if (file) formData.append('profilePic', file);

        const res = await api.register(formData)

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert('Account created successfully!');
        formik.resetForm();
        setPreview(null);
        setFile(null);
      } catch (err) {
        setError(err.message || 'Registration failed');
      }
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG or GIF allowed');
      return;
    }
  
    try {
      const options = {
        maxSizeMB: 0.5, // Compress to ~500KB max
        maxWidthOrHeight: 500, // Resize image dimensions if needed
        useWebWorker: true,
      };
  
      const compressedFile = await imageCompression(file, options);
      setFile(compressedFile);
  
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('Failed to compress image. Try another one.');
    }
  };
  return (
    <RegisterForm preview={preview} handleImageChange={handleImageChange} error={error} formik={formik}/>
  );
}
