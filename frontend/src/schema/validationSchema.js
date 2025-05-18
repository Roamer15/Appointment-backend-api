import * as Yup from 'yup'
export const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(15, 'Password must be at most than 15 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
    role: Yup.string().oneOf(['client', 'provider']).required('Role is required'),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms'),
  });