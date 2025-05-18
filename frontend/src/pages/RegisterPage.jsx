import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';
import RegisterForm from '../components/auth/register/RegisterForm';
import Spinner from '../components/Spinner';
import api from '../services/api';
import { validationSchema } from '../schema/validationSchema';
import { compressImage, isValidImage } from '../utils/imageUtils'; // See below

export default function RegisterPage() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
      setIsLoading(true);
      try {
        const formData = new FormData();
        const [firstName, ...lastParts] = values.fullName.trim().split(' ');
        const lastName = lastParts.join(' ') || '-';

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('role', values.role);
        if (file instanceof File) {
          formData.append('profilePic', file);
        }

        const res = await api.register(formData);
        if (res.error) throw new Error(res.error);

        // ✅ Success
        navigate('/email-verification', { state: { email: values.email } });
        formik.resetForm();
        setPreview(null);
        setFile(null);
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!isValidImage(selected)) {
      alert('Only JPEG, PNG, JPG or GIF allowed');
      return;
    }

    try {
      const compressed = await compressImage(selected);
      setFile(compressed);
      const blobUrl = URL.createObjectURL(compressed);
      setPreview(blobUrl);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('Failed to compress image. Try another one.');
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































// import { useState } from 'react';
// import RegisterForm from '../components/auth/register/RegisterForm'
// import { useFormik } from 'formik';
// import { validationSchema } from '../schema/validationSchema';
// import api from '../services/api';
// import imageCompression from 'browser-image-compression';
// import { useNavigate } from 'react-router';
// import Spinner from '../components/Spinner';

// export default function RegisterPage() {
//   const [preview, setPreview] = useState(null);
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false)

//   const navigate = useNavigate()

//   const formik = useFormik({
//     initialValues: {
//       fullName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       role: 'client',
//       terms: false,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setError('');
//       setIsLoading(true); // Start loading
//       try {
//         const formData = new FormData();
//         const [firstName, ...lastParts] = values.fullName.split(' ');
//         const lastName = lastParts.join(' ') || '-';
//         formData.append('firstName', firstName);
//         formData.append('lastName', lastName);
//         formData.append('email', values.email);
//         formData.append('password', values.password);
//         formData.append('role', values.role);
//         if (file) formData.append('profilePic', file);

//         const res = await api.register(formData)

//         if (res.error) {
//           console.log('Error' ,res.error)
//           throw new Error(res.error)
//         };
//         console.log('Account created successfully!');
//         setIsLoading(false)
//          navigate("/email-verification", { state: { email: values.email } });
//         formik.resetForm();
//         setPreview(null);
//         setFile(null);
//       } catch (err) {
//         setIsLoading(false)
//         setError(err.message || 'Registration failed');
//       }
//     },
//   });

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
  
//     // Check file type
//     const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
//     if (!validTypes.includes(file.type)) {
//       alert('Only JPEG, PNG, JPG or GIF allowed');
//       return;
//     }
  
//     try {
//       const options = {
//         maxSizeMB: 0.5, // Compress to ~500KB max
//         maxWidthOrHeight: 500, // Resize image dimensions if needed
//         useWebWorker: true,
//       };
  
//       const compressedFile = await imageCompression(file, options);
//       setFile(compressedFile);
  
//       const reader = new FileReader();
//       reader.onload = () => setPreview(reader.result);
//       reader.readAsDataURL(compressedFile);
//     } catch (error) {
//       console.error('Image compression failed:', error);
//       alert('Failed to compress image. Try another one.');
//     }
//   };
//   return (
//     <>
//     {isLoading && <Spinner />}

//     <RegisterForm preview={preview} handleImageChange={handleImageChange} error={error} formik={formik}/>
//     </>
//   );
// }
