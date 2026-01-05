import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import imageCompression from 'browser-image-compression';
import './switchStyle.css';

// MUI
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  CardContent,
  CardMedia,
  Container,
  Select,
  Chip,
  Tooltip,
  Typography,
  FormControl,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  CatalogActions,
  ActionIcon,
  CatalogsView,
  AddCatalog,
  Form,
  CatalogImage,
  ButtonIcon,
  UploadImage,
  InputFile,
  CustomTextField,
  CatalogueSwitchButton,
} from './NewCatalogueStyles';
//Components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import IconSnackbar from '../../../components/IconSnackbar';
//Services
import cardService from '../../../services/card.services';
import catalogService from '../../../services/catalogue.services';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
};

const NewCatalogue = () => {
  const theme = useTheme();
  const [cardName, setCardName] = useState([]);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [checkAgain, setCheckAgain] = useState(false);
  const [initialCardData, setInitialCardData] = useState([]);
  const [dropDownList, setDropDownList] = useState([]);
  const [themeSelectorSwitch, setThemeSelectorSwitch] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  let cardList = [];
  let cards = [];

  useEffect(async () => {
    await cardService.getAllCards(user.data ? user.data.id : user.id).then((response) => {
      if (response) {
        response.cards?.map((card) => {
          cards.push(card);
          cardList.push(card.cardName);
        });
      }
    });
    setInitialCardData(cards);
    setDropDownList(cardList);
  }, []);

  const handleBack = (navigate) => {
    navigate(-1);
  };

  const handleSwitchChange = () => {
    setThemeSelectorSwitch(!themeSelectorSwitch);
  };

  const openImageInput = () => {
    const inputImage = document.getElementById('inputImage');
    inputImage.click();
  };

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
        setFieldValue('image', imageReader.result);
      };
    }
  };

  const NewCatalogSchema = Yup.object().shape({
    image: Yup.mixed().required('Catalog Image Required'),
    title: Yup.string().required('Title is required'),
  });

  const formik = useFormik({
    initialValues: {
      image: '',
      title: '',
      description: '',
      url: '',
      price: '',
    },
    validationSchema: NewCatalogSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      let cardId = [];
      initialCardData?.map((data, index) => {
        if (cardName.includes(data.cardName)) {
          cardId.push({
            id: data.id,
            name: cardName.length > 1 ? cardName[index] : cardName[0],
          });
        }
      });

      const updatedValues = Object.assign(
        { ...values },
        {
          card: cardId,
          isCardTheme: themeSelectorSwitch,
        }
      );
      catalogService.newCatalogue(updatedValues, user.data ? user.data.id : user.id).then((resp) => {
        setSuccess('Catalog successfully created.');
        setTimeout(() => {
          setOpen(true);
          actions.setSubmitting(false);
        }, 1000);
        setTimeout(() => {
          navigate('/app/catalogue');
        }, 3000);
      });
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched } = formik;

  useEffect(() => {
    setTimeout(() => {
      setCheckAgain(false);
    }, 2000);
  }, [checkAgain]);

  const handleCardChange = (event) => {
    const {
      target: { value },
    } = event;
    setCardName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const getIcon = (icon, width = 16, height = 16) => <Iconify icon={icon} width={width} height={height} />;

  return (
    <Page title="Add Catalog">
      <IconSnackbar open={checkAgain} setOpen={handleSubmit} type="error" title="Error" msg={errors.image} />
      <IconSnackbar open={open} setOpen={setOpen} type="success" title="Success" msg={success} />
      <Container maxWidth="xl">
        <CatalogActions>
          <Tooltip title="Back">
            <ActionIcon icon="eva:arrow-back-fill" onClick={() => handleBack(navigate)} />
          </Tooltip>
        </CatalogActions>

        <CatalogsView>
          <AddCatalog>
            <Form>
              <CatalogImage color="grey">
                {values.image ? (
                  <>
                    <CardMedia
                      component="img"
                      image={values.image}
                      alt="avatar"
                      sx={{ height: '100%', objectFit: 'contain' }}
                    />
                    <ButtonIcon
                      variant="contained"
                      onClick={openImageInput}
                      indicator={values.theme}
                      sx={{ top: 12, right: 64 }}
                    >
                      {getIcon('bi:camera-fill')}
                    </ButtonIcon>
                    <ButtonIcon
                      variant="contained"
                      onClick={() => setFieldValue('image', '')}
                      indicator={values.theme}
                      sx={{ top: 12, right: 24 }}
                    >
                      {getIcon('bi:trash-fill')}
                    </ButtonIcon>
                  </>
                ) : (
                  <UploadImage htmlFor="inputImage" background="/static/illustrations/avatar-background.svg">
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
                  id="inputImage"
                  type="file"
                  accept="image/*"
                  name="profile"
                  onChange={(e) => handleImage(e, setFieldValue)}
                />
              </CatalogImage>
              <CardContent sx={{ p: '0 !important', mb: 2, mt: 5 }}>
                <CustomTextField
                  fullWidth
                  variant="standard"
                  name="title"
                  label="Catalogue Title"
                  value={values.title}
                  onChange={handleChange}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  sx={{ mx: 3, width: '-webkit-fill-available' }}
                  indicator="grey"
                />
                <CustomTextField
                  fullWidth
                  variant="standard"
                  name="description"
                  label="Catalogue Description "
                  value={values.description}
                  multiline
                  onChange={handleChange}
                  sx={{ mx: 3, width: '-webkit-fill-available', mt: 3 }}
                  indicator="grey"
                />
                <CustomTextField
                  fullWidth
                  variant="standard"
                  name="url"
                  label="Catalogue URL "
                  value={values.url}
                  onChange={handleChange}
                  sx={{ mx: 3, width: '-webkit-fill-available', mt: 3 }}
                  indicator="grey"
                />
                <CustomTextField
                  fullWidth
                  variant="standard"
                  name="price"
                  label="Catalogue Price "
                  value={values.price}
                  onChange={handleChange}
                  sx={{ mx: 3, width: '-webkit-fill-available', mt: 3 }}
                  indicator="grey"
                />
              </CardContent>
            </Form>

            <FormControl sx={{ width: 300, mx: 3, width: '-webkit-fill-available', mb: 3, mt: 2 }}>
              <InputLabel id="multiple-chip-label">Card</InputLabel>
              <Select
                labelId="multiple-chip-label"
                id="multiple-chip"
                multiple
                defaultValue=""
                value={cardName}
                onChange={handleCardChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" required />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                required
                MenuProps={MenuProps}
              >
                {dropDownList.map((card) => (
                  <MenuItem key={card} value={card} style={getStyles(card, cardName, theme)}>
                    {card}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <CatalogueSwitchButton>
              <label className="switch">
                <input type="checkbox" onChange={handleSwitchChange} />
                <span className="slider"></span>
              </label>
              <span style={{ color: '#72797f', fontWeight: 400, fontSize: '16px' }}>Add Card Theme</span>
            </CatalogueSwitchButton>

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
                handleSubmit();
                if (errors.image) {
                  setCheckAgain(true);
                }
              }}
            >
              Save
            </LoadingButton>
          </AddCatalog>
        </CatalogsView>
      </Container>
    </Page>
  );
};

export default NewCatalogue;
