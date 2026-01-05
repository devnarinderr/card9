import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import IconSnackbar from '../../../components/IconSnackbar';
import mailService from '../../../services/mail.services';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, actions) => {
      mailService.forgotPassword(values.email).then((response) => {
        if (response.status !== 400) {
          setOpen(true);
          setSuccess(response.data.msg);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 500);
          setTimeout(() => {
            setSuccess(null);
            navigate('/login', { replace: true });
          }, 3000);
        } else {
          setOpen(true);
          setError(response.data.msg);
          setTimeout(() => {
            actions.setSubmitting(false);
            setOpen(false);
            setError(null);
          }, 3000);
        }
      });
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <IconSnackbar
        open={open}
        setOpen={setOpen}
        type={success ? 'success' : 'error'}
        title={success ? 'Success' : 'Error'}
        msg={success ? success : error}
      />
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ my: 2 }}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Send Reset Link
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
