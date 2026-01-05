import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import imageCompression from 'browser-image-compression';
// @mui
import {
  CardContent,
  CardMedia,
  Container,
  Tooltip,
  Typography,
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  FormControl,
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
  ButtonIcon,
  BasicDetails,
  CustomTextField,
  CatalogueSwitchButton,
} from './EditCatalogueStyles';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
// data
import IconSnackbar from '../../../components/IconSnackbar';
import { useTheme } from '@emotion/react';
import cardService from '../../../services/card.services';
import catalogueService from '../../../services/catalogue.services';

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

export default function EditCatalogue() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { catalogueData } = useSelector((state) => state.catalogue);
  const [checkAgain, setCheckAgain] = useState(false);

  const [cardName, setCardName] = useState('');
  const [themeSelectorSwitch, setThemeSelectorSwitch] = useState(false);
  const [dropDownList, setDropDownList] = useState([]);

  const [initialCardData, setInitialCardData] = useState([]);

  const allowedFileTypes = `image/gif image/png, image/jpeg, image/x-png`;

  const [caltalogueNameError, setCatalogueNameError] = useState('');
  const [caltalogueName, setCatalogueName] = useState(false);

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(null);

  const { user } = useSelector((state) => state.auth);

  let cardList = [];
  let cards = [];

  useEffect(() => {
    let temp = [];
    catalogueData?.catalogue.card.map((item) => {
      temp.push(item.name);
    });
    setCardName(temp);
    setThemeSelectorSwitch(catalogueData?.catalogue.theme ? true : false);
  }, [catalogueData]);

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

  const handleCardChange = (event) => {
    const {
      target: { value },
    } = event;
    setCardName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
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

  const EditCatalogueSchema = Yup.object().shape({
    image: Yup.mixed().required('Profile Image Required'),
    title: Yup.string().required('Title is required'),
  });

  const formik = useFormik({
    initialValues: {
      image: catalogueData ? catalogueData.catalogue.image : '',
      title: catalogueData ? catalogueData.catalogue.title : '',
      description: catalogueData ? catalogueData.catalogue.description : '',
      price: catalogueData ? catalogueData.catalogue.price : '',
      url: catalogueData ? catalogueData.catalogue.url : '',
    },
    validationSchema: EditCatalogueSchema,
    onSubmit: (values, actions) => {
      let cardId = [];
      initialCardData?.map((data, index) => {
        if (cardName.includes(data.cardName)) {
          cardId.push({
            id: data.id,
            name: cardName.length > 1 ? cardName[index] : cardName[0],
          });
        }
      });

      if (cardName.length > 0) {
        const updatedValues = Object.assign(
          { ...values },
          {
            card: cardId,
            isCardTheme: themeSelectorSwitch,
            userId: user.data ? user.data.id : user.id,
          }
        );

        catalogueService.editCatalogue(updatedValues, catalogueData?.catalogue.id).then((resp) => {
          setSuccess('Catalog successfully Edited.');
          setTimeout(() => {
            setOpen(true);
            actions.setSubmitting(false);
          }, 1000);
          setTimeout(() => {
            navigate('/app/catalogue');
          }, 3000);
        });
      } else {
        actions.setSubmitting(false);
      }
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched } = formik;

  useEffect(() => {
    setTimeout(() => {
      setCheckAgain(false);
    }, 2000);
  }, [checkAgain]);

  const CatalogueFields = [
    { label: 'Catalogue Title', value: 'title' },
    { label: 'Catalogue Description', value: 'description' },
    { label: 'Catalogue URL', value: 'url' },
    { label: 'Catalogue Price', value: 'price' },
  ];

  const getIcon = (icon, width = 16, height = 16) => <Iconify icon={icon} width={width} height={height} />;

  return (
    <Page title="Edit Catalogue">
      <IconSnackbar open={checkAgain} setOpen={handleSubmit} type="error" title="Error" msg={errors.image} />
      <IconSnackbar open={caltalogueName} setOpen={handleSubmit} type="error" title="Error" msg={caltalogueNameError} />
      <IconSnackbar open={open} setOpen={setOpen} type="success" title="Success" msg={success} />
      <Container maxWidth="xl">
        <CardActions>
          <Tooltip title="Back">
            <ActionIcon icon="eva:arrow-back-fill" onClick={() => handleBack(navigate)} />
          </Tooltip>
        </CardActions>
        <CardsView>
          <AddCard>
            <Form>
              <ProfileImage color={catalogueData?.catalogue.theme}>
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
                      indicator={catalogueData?.catalogue.theme}
                      sx={{ top: 12, right: 64 }}
                    >
                      {getIcon('bi:camera-fill')}
                    </ButtonIcon>
                    <ButtonIcon
                      variant="contained"
                      onClick={() => {
                        setFieldValue('image', '');
                      }}
                      indicator={catalogueData?.catalogue.theme}
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
                      Upload a catalogue image
                    </Typography>
                  </UploadImage>
                )}
                <InputFile
                  id="inputImage"
                  type="file"
                  name="image"
                  accept={allowedFileTypes}
                  onChange={(e) => handleImage(e, setFieldValue)}
                />
              </ProfileImage>
              <CardContent sx={{ p: '0 !important', mb: 2 }}>
                <BasicDetails sx={{ p: 3, pb: 1 }}>
                  {CatalogueFields.map((field, index) => (
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
                </BasicDetails>
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
          </AddCard>
        </CardsView>
      </Container>
    </Page>
  );
}
