import { useLocation, useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import RegisterProviderForm from '../components/auth/register/RegisterProviderForm';

export default function ProviderDetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userId, email } = state || {};

  const formik = useFormik({
    initialValues: {
      specialty: '',
      bio: '',
    },
    validationSchema: Yup.object({
      specialty: Yup.string().required('Specialty is required'),
      bio: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.completeProviderProfile({ userId, ...values });

        if (res.error) throw new Error(res.error);
        toast.success('Provider profile completed!');
        navigate('/email-verification', { state: { email } });
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      }
    },
  });

  return (
    <RegisterProviderForm formik={formik}/>
  );
}
