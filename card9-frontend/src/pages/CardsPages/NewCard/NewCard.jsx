import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { SketchPicker } from 'react-color';
import imageCompression from 'browser-image-compression';
// @mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CardContent,
  CardMedia,
  Container,
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CardActions,
  ActionIcon,
  CardsView,
  AddCard,
  Form,
  ProfileImage,
  UploadImage,
  InputFile,
  ClippedSVG,
  ButtonIcon,
  UploadLogo,
  CardLogo,
  CardTheme,
  ColorButton,
  BasicDetails,
  InfoBadges,
  InfoBadge,
  InfoTextFields,
  RemoveIcon,
  CustomTextField,
  InfoPicker,
  GridItem,
} from './NewCardStyles';
import Dialog from '@mui/material/Dialog';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
// data
import pickerData from '../../../assets/picker.json';
import CardService from '../../../services/card.services';
import IconSnackbar from '../../../components/IconSnackbar';
import SEO from '../../../common/seo';
import ogCreate from '../../../assets/images/ogImages/ogCreate.png';

export default function NewCard() {
  const navigate = useNavigate();

  const handleBack = (navigate) => {
    navigate(-1);
  };

  const openProfileInput = () => {
    const inputProfile = document.getElementById('inputProfile');
    inputProfile.click();
  };

  const openLogoInput = () => {
    const inputLogo = document.getElementById('inputLogo');
    inputLogo.click();
  };

  const [checkAgain, setCheckAgain] = useState(false);
  const [cardNameError, setCardNameError] = useState('');
  const [cardName, setCardName] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [openColorSelector, setOpenColorSelector] = useState(false);
  const [isVideoProfile, setIsVideoProfile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(false);

  const handleVideoMute = () => setIsMuted(!isMuted);

  function getFileExtension(filename) {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return parts.pop();
    }
    return null;
  }

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let fileExtension = getFileExtension(file.name);
    if (file && file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
    } else {
      setError('');

      if (fileExtension === 'mp4') {
        setIsVideoProfile(true);
        const videoReader = new FileReader();
        if (file) {
          videoReader.readAsDataURL(file);
          videoReader.onloadend = () => {
            setFieldValue('isVideoProfile', true);
            setFieldValue('profile', videoReader.result);
          };
        }
      } else {
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };
        if (e.target.files && e.target.files.length) {
          const imageReader = new FileReader();
          if (e.target.name === 'profile') {
            const compressFile = await imageCompression(e.target.files[0], options);
            imageReader.readAsDataURL(compressFile);
            imageReader.onloadend = () => {
              setFieldValue('profile', imageReader.result);
            };
          } else {
            const compressFile = await imageCompression(e.target.files[0], options);
            imageReader.readAsDataURL(compressFile);
            imageReader.onloadend = () => {
              setFieldValue('logo', imageReader.result);
            };
          }
        }
      }
    }
  };

  const cardThemeColors = ['#8f60DE', '#628AF8', '#6DD3C7', '#3BB55D', '#FFC631', '#FF8C39', '#EA3A2E', '#4A4A4A'];

  const NewCardSchema = Yup.object().shape({
    profile: Yup.mixed().required('Profile Image Required'),
    logo: Yup.mixed().required('Logo Image Required'),
    cardName: Yup.string()
      .min(3, 'Card name must be atleast 3 characters')
      .max(15, 'Card name must be at most 15 characters')
      .required('Card name is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    title: Yup.string().required('Title is required'),
    phone: Yup.number().required('Phone number is required'),
    company: Yup.string().required('Company is required'),
  });

  const { user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      profile: '',
      logo: '',
      theme: cardThemeColors[0],
      cardName: '',
      prefix: '',
      firstName: '',
      middleName: '',
      lastName: '',
      title: '',
      department: '',
      company: '',
      headline: '',
      phone: '',
      whatsapp: '',
      email: '',
      website: '',
      instagram: '',
      facebook: '',
      address: '',
      addressUrl: '',
      isVideoProfile: false,
      info: [],
    },
    validationSchema: NewCardSchema,
    onSubmit: (values, actions) => {
      const finalData = Object.assign(
        { ...values },
        {
          cardName: values.cardName.replace(/\s+/g, ''),
        }
      );
      try {
        CardService.newCard(finalData, user.data ? user.data.id : user.id).then((resp) => {
          if (resp.status === 400) {
            setCardNameError(resp.data.msg);
            setCardName(true);
            setTimeout(() => {
              actions.setSubmitting(false);
              setCardName(false);
            }, 2000);
          } else {
            setSuccess('Card successfully created.');
            setTimeout(() => {
              setOpen(true);
              actions.setSubmitting(false);
            }, 1000);
            setTimeout(() => {
              navigate('/app/cards');
            }, 3000);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched } = formik;

  useEffect(() => {
    setTimeout(() => {
      setCheckAgain(false);
    }, 2000);
  }, [checkAgain]);

  const addInfoBadge = (picker) => {
    const badges = values.info;
    badges.push(picker);
    setFieldValue('info', badges);
  };

  const removeBadge = (index) => {
    const badges = values.info;
    badges.splice(index, 1);
    setFieldValue('info', badges);
  };

  const fullNameFields = [
    { label: 'Prefix', value: 'prefix' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Middle Name', value: 'middleName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Phone', value: 'phone' },
  ];

  const infoFields = [
    { label: 'Title', value: 'title' },
    { label: 'Company', value: 'company' },
    { label: 'Headline', value: 'headline' },
    { label: 'Department', value: 'department' },
  ];

  const contactFields = [
    { label: 'Whatsapp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'Address', value: 'address' },
    { label: 'Address Map Url', value: 'addressUrl' },
    { label: 'Website', value: 'website' },
    { label: 'Instagram username', value: 'instagram' },
    { label: 'Facebook username', value: 'facebook' },
  ];

  const getIcon = (icon, width = 16, height = 16) => <Iconify icon={icon} width={width} height={height} />;

  return (
    <Page title="Add Card">
      <SEO title="Add card" image={ogCreate} />

      <Dialog
        open={openColorSelector}
        keepMounted
        onClose={() => setOpenColorSelector(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <SketchPicker color={values.theme} onChange={(color) => setFieldValue('theme', color.hex)} />
      </Dialog>

      <IconSnackbar
        open={error}
        setOpen={setError}
        type="error"
        title="Error"
        msg="File size should be less than 10MB"
      />
      <IconSnackbar
        open={checkAgain}
        setOpen={handleSubmit}
        type="error"
        title="Error"
        msg={errors.profile ? errors.profile : errors.logo}
      />
      <IconSnackbar open={cardName} setOpen={handleSubmit} type="error" title="Error" msg={cardNameError} />
      <IconSnackbar open={open} setOpen={setOpen} type="success" title="Success" msg={success} />
      <Container maxWidth="xl">
        <CardActions>
          <Tooltip title="Back">
            <ActionIcon icon="eva:arrow-back-fill" onClick={() => handleBack(navigate)} />
          </Tooltip>
        </CardActions>
        <CardsView>
          <AddCard>
            <Form onSubmit={handleSubmit}>
              <ProfileImage color={values.theme}>
                {values.profile ? (
                  <>
                    {isVideoProfile ? (
                      <CardMedia
                        component="video"
                        src={values.profile}
                        autoPlay
                        muted={isMuted}
                        loop
                        alt="avatar"
                        sx={{ height: '100%' }}
                      />
                    ) : (
                      <CardMedia component="img" image={values.profile} alt="avatar" sx={{ height: '100%' }} />
                    )}
                    <ButtonIcon
                      variant="contained"
                      onClick={openProfileInput}
                      indicator={values.theme}
                      sx={{ top: 12, right: 104 }}
                    >
                      {getIcon('bi:camera-fill')}
                    </ButtonIcon>
                    <ButtonIcon
                      variant="contained"
                      onClick={() => setFieldValue('profile', '')}
                      indicator={values.theme}
                      sx={{ top: 12, right: 64 }}
                    >
                      {getIcon('bi:trash-fill')}
                    </ButtonIcon>

                    {isVideoProfile ? (
                      <ButtonIcon
                        variant="contained"
                        onClick={() => handleVideoMute()}
                        indicator={values.theme}
                        sx={{ top: 12, right: 24 }}
                      >
                        {getIcon('ant-design:sound-filled')}
                      </ButtonIcon>
                    ) : (
                      <ButtonIcon
                        variant="contained"
                        onClick={() => handleVideoMute()}
                        sx={{ top: 12, right: 24, cursor: 'default' }}
                      ></ButtonIcon>
                    )}
                  </>
                ) : (
                  <UploadImage htmlFor="inputProfile" background="/static/illustrations/avatar-background.svg">
                    <Typography
                      sx={{
                        textAlign: 'center',
                        pt: 2,
                        opacity: 0.5,
                      }}
                    >
                      Upload a photo or video
                    </Typography>
                  </UploadImage>
                )}
                <InputFile
                  id="inputProfile"
                  type="file"
                  accept="video/*,image/*"
                  name="profile"
                  onChange={(e) => handleImage(e, setFieldValue)}
                />
                <ClippedSVG color={values.theme} />
                {values.logo ? (
                  <>
                    <CardLogo component="img" height="60" image={values.logo} alt="logo" />
                    <ButtonIcon
                      variant="contained"
                      onClick={openLogoInput}
                      indicator={values.theme}
                      sx={{ bottom: 36, right: 24 }}
                    >
                      {getIcon('bi:camera-fill')}
                    </ButtonIcon>
                    <ButtonIcon
                      variant="contained"
                      onClick={() => setFieldValue('logo', '')}
                      indicator={values.theme}
                      sx={{ bottom: 0, right: 24 }}
                    >
                      {getIcon('bi:trash-fill')}
                    </ButtonIcon>
                  </>
                ) : (
                  <UploadLogo htmlFor="inputLogo">
                    {getIcon('carbon:add', 22, 22)}
                    <Typography>Logo</Typography>
                  </UploadLogo>
                )}
                <InputFile id="inputLogo" type="file" accept="image/*" name="logo" onChange={(e) => handleImage(e)} />
              </ProfileImage>
              <CardTheme>
                {cardThemeColors.map((color, index) => (
                  <ColorButton
                    key={index}
                    color={color}
                    onClick={() => setFieldValue('theme', color)}
                    active={values.theme === color ? 1 : 0}
                  />
                ))}
                <Button onClick={() => setOpenColorSelector(true)}>{getIcon('carbon:add', 22, 22)}</Button>
              </CardTheme>
              <CardContent sx={{ p: '0 !important', mb: 2 }}>
                <CustomTextField
                  fullWidth
                  variant="standard"
                  name="cardName"
                  label="Card Name (This name is use for your card url)"
                  value={values.cardName}
                  onChange={handleChange}
                  error={touched.cardName && Boolean(errors.cardName)}
                  helperText={touched.cardName && errors.cardName}
                  sx={{ mx: 3, width: '-webkit-fill-available' }}
                  indicator={values.theme}
                />
                <BasicDetails sx={{ p: 3, pb: 1 }}>
                  <Accordion defaultExpanded sx={{ m: '0 !important' }}>
                    <AccordionSummary
                      expandIcon={getIcon('fa:angle-down')}
                      sx={{
                        '&.Mui-expanded': {
                          minHeight: 0,
                          margin: 0,
                          padding: 0,
                        },
                        '& .MuiAccordionSummary-content.Mui-expanded': {
                          margin: 0,
                        },
                        '&.MuiButtonBase-root': {
                          padding: 0,
                        },
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>Basic Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {fullNameFields.map((field, index) => (
                        <CustomTextField
                          key={index}
                          fullWidth
                          variant="standard"
                          name={field.value}
                          label={field.label}
                          value={values[field.value]}
                          onChange={handleChange}
                          error={field.value && touched[field.value] && Boolean(errors[field.value])}
                          helperText={field.value && touched[field.value] && errors[field.value]}
                          indicator={values.theme}
                          style={{ marginTop: 5 }}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion defaultExpanded sx={{ m: '0 !important' }}>
                    <AccordionSummary
                      expandIcon={getIcon('fa:angle-down')}
                      sx={{
                        '&.Mui-expanded': {
                          minHeight: 0,
                          margin: 0,
                          padding: 0,
                        },
                        '& .MuiAccordionSummary-content.Mui-expanded': {
                          margin: 0,
                        },
                        '&.MuiButtonBase-root': {
                          padding: 0,
                        },
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>Company Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {infoFields.map((field, index) => (
                        <CustomTextField
                          key={index}
                          fullWidth
                          variant="standard"
                          name={field.value}
                          label={field.label}
                          value={values[field.value]}
                          onChange={handleChange}
                          multiline={field.multiline}
                          rows={3}
                          style={{ marginTop: 5 }}
                          error={field.value && touched[field.value] && Boolean(errors[field.value])}
                          helperText={field.value && touched[field.value] && errors[field.value]}
                          indicator={values.theme}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion defaultExpanded sx={{ m: '0 !important' }}>
                    <AccordionSummary
                      expandIcon={getIcon('fa:angle-down')}
                      sx={{
                        '&.Mui-expanded': {
                          minHeight: 0,
                          margin: 0,
                          padding: 0,
                        },
                        '& .MuiAccordionSummary-content.Mui-expanded': {
                          margin: 0,
                        },
                        '&.MuiButtonBase-root': {
                          padding: 0,
                        },
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>Contact Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {contactFields.map((field, index) => (
                        <CustomTextField
                          key={index}
                          fullWidth
                          variant="standard"
                          name={field.value}
                          label={field.label}
                          value={values[field.value]}
                          onChange={handleChange}
                          multiline={field.multiline}
                          rows={3}
                          style={{ marginTop: 5 }}
                          indicator={values.theme}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </BasicDetails>
                <InfoBadges>
                  {values.info.map((item, index) => (
                    <InfoBadge key={index} sx={{ px: 4.8, mb: 1 }}>
                      <InfoTextFields>
                        <CustomTextField
                          fullWidth
                          variant="standard"
                          name={`info.${index}.value `}
                          placeholder={`${item.name} username`}
                          value={item.value}
                          onChange={handleChange}
                          indicator={values.theme}
                          sx={{ py: 1 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">{getIcon(item.icon, 24, 24)}</InputAdornment>
                            ),
                          }}
                        />
                      </InfoTextFields>
                      <RemoveIcon onClick={() => removeBadge(index)}>{getIcon('mdi:close', 22, 22)}</RemoveIcon>
                    </InfoBadge>
                  ))}
                </InfoBadges>
              </CardContent>
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                sx={{
                  background: values.theme,
                  borderRadius: 0,
                  position: 'sticky',
                  bottom: 0,
                }}
                loading={isSubmitting}
                onClick={() => {
                  if (errors.profile || errors.logo) {
                    setCheckAgain(true);
                  }
                }}
              >
                Save
              </LoadingButton>
            </Form>
          </AddCard>
          <InfoPicker indicator={values.theme}>
            <Typography sx={{ fontSize: 16, mb: 3 }} color="text.secondary">
              Add more information:
            </Typography>
            <Grid container spacing={2}>
              {pickerData.map((picker, index) => (
                <GridItem item xs={4} key={index} onClick={() => addInfoBadge(picker)}>
                  {getIcon(picker.icon, 32, 32)}
                  <Typography variant="body2">{picker.name}</Typography>
                </GridItem>
              ))}
            </Grid>
          </InfoPicker>
        </CardsView>
      </Container>
    </Page>
  );
}
