import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
// @mui
import { Card, CardHeader, Container, Rating, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// components
import Page from '../components/Page';
import IconSnackbar from '../components/IconSnackbar';
import mailService from '../services/mail.services';

// ----------------------------------------------------------------------

const SupportCard = styled(Card)({
  height: '100%',
  padding: 0,
  marginBottom: 24,
  borderRadius: '0.5rem',
});

const Form = styled('form')({
  padding: 16,
  paddingTop: 8,
});

// -------------------------------------------------~ ---------------------

export default function Feedback() {
  const [feedbackSent, setFeedbackSent] = useState(false);

  const feedbackSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    message: Yup.string().required('Field is required'),
  });

  const { user } = useSelector((state) => state.auth);

  const feedbackFormik = useFormik({
    initialValues: {
      name: user.data ? `${user.data.firstName} ${user.data.lastName}` : `${user.firstName} ${user.lastName}`,
      message: '',
      rating: 0,
      subject: 'Feedback',
    },
    validationSchema: feedbackSchema,
    onSubmit: (values, actions) => {
      mailService.feedbackMail(values);
      setTimeout(() => {
        setFeedbackSent(true);
        actions.setSubmitting(false);
        feedbackFormik.resetForm();
      }, 2000);
    },
  });

  const { values, handleChange, handleSubmit, isSubmitting, errors, touched } = feedbackFormik;

  return (
    <Page title="Send Feedback">
      <Container>
        <SupportCard>
          <CardHeader title="How would you rate Us?" sx={{ px: 2 }} />
          <Form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="example@mail.com"
              variant="standard"
              name="email"
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              variant="standard"
              name="message"
              placeholder="Experiencing issues? Let us know and we'll do our best to help out!"
              value={values.message}
              multiline
              rows={8}
              onChange={handleChange}
              error={touched.message && Boolean(errors.message)}
              helperText={touched.message && errors.message}
              sx={{ my: 2 }}
            />
            <Rating
              name="rating"
              value={parseInt(values.rating, 10)}
              onChange={handleChange}
              size="large"
              sx={{ display: 'flex', mb: 2 }}
            />
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              Send
            </LoadingButton>
          </Form>
          <IconSnackbar
            open={feedbackSent}
            setOpen={setFeedbackSent}
            title="Success"
            msg="Thank you for your feedback!"
          />
        </SupportCard>
      </Container>
    </Page>
  );
}
