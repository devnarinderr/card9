import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import imageCompression from 'browser-image-compression';
// @mui
import {
  Avatar,
  Button,
  CardActionArea,
  CardActions,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateEmail, updateProfile } from '../../actions/auth';
import { SettingCard, CardTitle, CardClickArea, CardClickAreas, Form, InputFile } from './SettingStyle';
// components
import accountImage from '../../assets/images/account.png';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import IconSnackbar from '../../components/IconSnackbar';
import Loader from '../../components/Loader';
import SEO from '../../common/seo';
import ogSettings from '../../assets/images/ogImages/ogSettings.png';
import mailService from '../../services/mail.services';
import { Link as RouterLink } from 'react-router-dom';

export default function Settings() {
  const theme = useTheme();

  const [toggleProfile, setToggleProfile] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [toggleEmail, setToggleEmail] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [passwordResetSend, setPasswordResetSend] = useState(false);
  const [loadingPasswordReset, setLoadingPasswordReset] = useState(false);

  const handleClose = () => {
    setToggleProfile(false);
    setToggleEmail(false);
    setDeleteAccount(false);
  };

  const openProfileInput = () => {
    const inputProfile = document.getElementById('inputProfile');
    inputProfile.click();
  };

  const { user } = useSelector((state) => state.auth);

  const handleImage = async (e) => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    if (e.target.files && e.target.files.length) {
      const imageReader = new FileReader();
      const compressFile = await imageCompression(e.target.files[0], options);
      imageReader.readAsDataURL(compressFile);
      imageReader.onloadend = () => {
        setFieldValue('profile', imageReader.result);
      };
    }
  };

  const handlePasswordReset = () => {
    mailService.resetPassword(
      user.data ? `${user.data.email}` : `${user?.email}`,
      user.data ? `${user.data.id}` : `${user?.id}`
    );
    setLoadingPasswordReset(true);
    setTimeout(() => {
      setPasswordResetSend(true);
      setLoadingPasswordReset(false);
    }, 2000);
  };

  const profileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const emailSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const deletionSchema = Yup.object().shape({
    text: Yup.string().oneOf(['delete']).required("Text 'delete' is required"),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let profileImage;
  if (user.data) {
    profileImage = user.data.profile;
  } else {
    profileImage = user.profile;
  }

  const profileFormik = useFormik({
    initialValues: {
      profile: profileImage ? `${profileImage}` : `${accountImage}`,
      name: user.data ? `${user.data.firstName} ${user.data.lastName}` : `${user?.firstName} ${user?.lastName}`,
    },
    validationSchema: profileSchema,
    onSubmit: (values, actions) => {
      const [firstName, lastName] = values.name.split(' ');
      const newValues = {
        profile: values.profile,
        first_name: firstName,
        last_name: lastName,
      };

      dispatch(updateProfile(newValues, user.data ? user.data.id : user.id));
      setTimeout(() => {
        actions.setSubmitting(false);
        handleClose();
        setProfileUpdated(true);
      }, 2000);
    },
  });

  const emailFormik = useFormik({
    initialValues: {
      email: user.data ? `${user.data.email}` : `${user?.email}`,
    },
    validationSchema: emailSchema,
    onSubmit: (values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        handleClose();
        dispatch(updateEmail(user.data ? user.data.id : user?.id, values.email));
        setEmailUpdated(true);
      }, 2000);
    },
  });

  const deletionFormik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: deletionSchema,
    onSubmit: (values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        handleClose();
        dispatch(deleteUser(user.data ? user.data.id : user?.id, user?.email)).then((res) => {
          navigate('/login');
        });
      }, 2000);
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched } = profileFormik;
  const {
    values: emailValues,
    handleChange: handleEmailChange,
    handleSubmit: handleEmailSubmit,
    isSubmitting: isEmailSubmitting,
    errors: emailError,
    touched: emailTouched,
  } = emailFormik;
  const {
    values: deleteValues,
    handleChange: handleDeleteChange,
    handleSubmit: handleDeleteSubmit,
    isSubmitting: isDeleteSubmitting,
    errors: deleteError,
    touched: deleteTouched,
  } = deletionFormik;

  const getIcon = (icon) => <Iconify icon={icon} width={22} height={22} />;

  return (
    <Page title="Settings">
      <SEO title="Settings" image={ogSettings} />
      <Container>
        <SettingCard>
          <CardTitle avatar={getIcon('eva:credit-card-fill')} title="Subscription" />
          <CardActions
            sx={{
              px: 2,
              justifyContent: 'space-between',
            }}
          >
            <Typography>{user.data ? `${user.data.subscription}` : `${user?.subscription}`}</Typography>
            <Button component={RouterLink} to="/app/pricing">
              <Typography>+ Renew Plan</Typography>
            </Button>
          </CardActions>

          <CardTitle avatar={getIcon('eva:people-fill')} title="Profile" />
          <CardActionArea>
            <CardClickArea
              avatar={
                values.profile ? (
                  <Avatar alt="" src={values.profile} sx={{ width: 48, height: 48 }} />
                ) : (
                  <Avatar sx={{ background: theme.palette.primary.main }} aria-label="profile">
                    {user.data ? `${user.data.firstName[0]}` : `${user?.firstName[0]}`}
                  </Avatar>
                )
              }
              action={getIcon('fa:angle-right')}
              title={
                user.data ? `${user.data.firstName} ${user.data.lastName}` : `${user?.firstName} ${user?.lastName}`
              }
              // subheader="Free"
              onClick={() => setToggleProfile(true)}
            />
            <Dialog open={toggleProfile} onClose={handleClose} maxWidth="xs" fullWidth>
              <Form onSubmit={handleSubmit}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                  <Avatar alt="" src={values.profile} sx={{ width: 120, height: 120, margin: 'auto', mb: 2 }} />
                  <Button variant="outlined" onClick={openProfileInput}>
                    Upload
                  </Button>
                  {values.profile && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setFieldValue('profile', accountImage);
                      }}
                      sx={{ ml: 1 }}
                    >
                      {getIcon('bi:trash-fill')}
                    </Button>
                  )}
                  <InputFile
                    id="inputProfile"
                    type="file"
                    accept="image/*"
                    name="profile"
                    onChange={(e) => handleImage(e, setFieldValue)}
                  />
                  <TextField
                    fullWidth
                    variant="standard"
                    name="name"
                    label="Name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ mt: 1 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Save
                  </LoadingButton>
                </DialogActions>
              </Form>
            </Dialog>
          </CardActionArea>
          <IconSnackbar
            open={profileUpdated}
            setOpen={setProfileUpdated}
            title="Success"
            msg="Your profile has been updated."
          />
        </SettingCard>
        <SettingCard>
          <CardTitle avatar={getIcon('eva:pie-chart-2-fill')} title="Account" />
          <CardActionArea>
            <CardClickAreas
              action={getIcon('fa:angle-right')}
              title="Change your email address"
              subheader={user.data ? `${user.data.email}` : `${user?.email}`}
              onClick={() => setToggleEmail(true)}
            />
            <Dialog open={toggleEmail} onClose={handleClose} maxWidth="xs" fullWidth>
              <Form onSubmit={handleEmailSubmit}>
                <DialogTitle>Update Your Email</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="email"
                    label="Email"
                    value={emailValues.email}
                    onChange={handleEmailChange}
                    error={emailTouched.name && Boolean(emailError.name)}
                    helperText={emailTouched.name && emailError.name}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <LoadingButton variant="contained" type="submit" loading={isEmailSubmitting}>
                    Update
                  </LoadingButton>
                </DialogActions>
              </Form>
            </Dialog>
          </CardActionArea>
          <CardActionArea>
            <CardClickAreas
              action={getIcon('fa:angle-right')}
              title="Reset Your Password"
              onClick={() => handlePasswordReset()}
            />
          </CardActionArea>
          <CardActionArea>
            <CardClickAreas
              action={getIcon('fa:angle-right')}
              title="Delete Account"
              onClick={() => setDeleteAccount(true)}
            />
            <Dialog open={deleteAccount} onClose={handleClose} maxWidth="xs" fullWidth>
              <Form onSubmit={handleDeleteSubmit}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Type "delete" to delete your account. <br />
                    <br />
                    All contacts and other data associated with this account will be permanently deleted. This cannot be
                    undone.
                  </DialogContentText>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="text"
                    value={deleteValues.text}
                    onChange={handleDeleteChange}
                    error={deleteTouched.text && Boolean(deleteError.text)}
                    helperText={deleteTouched.text && deleteError.text}
                  />
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Cancel
                  </Button>
                  <LoadingButton type="submit" loading={isDeleteSubmitting}>
                    Delete Account
                  </LoadingButton>
                </DialogActions>
              </Form>
            </Dialog>
          </CardActionArea>
          <IconSnackbar
            open={emailUpdated}
            setOpen={setEmailUpdated}
            title="Success"
            msg="Your email address has been updated."
          />
          <IconSnackbar
            open={passwordResetSend}
            setOpen={setPasswordResetSend}
            title="Success"
            msg="A password reset email has been sent to your email address."
          />
        </SettingCard>
        <Loader open={loadingPasswordReset} setOpen={setLoadingPasswordReset} />
      </Container>
    </Page>
  );
}
