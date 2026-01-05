import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFormik, Form, FormikProvider } from 'formik';
import * as htmlToImage from 'html-to-image';
import copy from 'copy-to-clipboard';

import { ColorRing } from 'react-loader-spinner';

// share
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
// library
import { QRCode } from 'react-qrcode-logo';
// @mui
import {
  Button,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  CardActions,
  ActionIcon,
  CardsView,
  ClippedSVG,
  CardLogo,
  PreviewCard,
  CardInfo,
  ListButton,
  ListIcon,
  BasicDetails,
  ButtonIcon,
  SendCard,
  CardTabs,
  CardTab,
  QRCodeTab,
  QRLink,
  ShareIcons,
  ShareIcon,
  EmailCard,
  CatalogueSection,
} from './ViewCardStyles';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import IconSnackbar from '../../../components/IconSnackbar';
import cardService from '../../../services/card.services';
import Logo from '../../../assets/images/Logo-33x33.png';
import ogViewCard from '../../../assets/images/ogImages/ogViewCard.png';
import SEO from '../../../common/seo';
import mailService from '../../../services/mail.services';
import catalogueService from 'src/services/catalogue.services';
import CatalogueCard from './CatalogueCard';
import { ExpDateChecker } from 'src/common/cardExp';
import { extractExtensionFromBase64 } from 'src/common/utilities';

ActionBar.propTypes = {
  navigate: PropTypes.func,
};

function ActionBar({ navigate }) {
  const [deleteCard, setDeleteCard] = useState(false);
  const [processDelete, setProcessDelete] = useState(false);
  const [cardDeleted, setCardDeleted] = useState(false);

  const { id } = useParams();

  const downloadQRCode = () => {
    const qrCode = document.getElementById('react-qrcode-logo');
    const qrImage = qrCode.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'download';
    link.href = qrImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCard = (id) => {
    cardService.deleteCard(id);
    setProcessDelete(true);
    setTimeout(() => {
      setProcessDelete(false);
      setDeleteCard(false);
      setCardDeleted(true);
    }, 2000);
    setTimeout(() => {
      navigate('/app/cards');
    }, 3000);
  };

  return (
    <CardActions>
      <Tooltip title="Back">
        <ActionIcon icon="eva:arrow-back-fill" onClick={() => navigate(-1)} />
      </Tooltip>
      <Tooltip title="Edit">
        <ActionIcon icon="eva:edit-outline" onClick={() => navigate('edit')} />
      </Tooltip>
      <Tooltip title="Virtual Background">
        <ActionIcon icon="eva:image-2-fill" onClick={() => navigate('backgrounds')} />
      </Tooltip>
      <Tooltip title="Download QR Code">
        <ActionIcon icon="eva:cloud-download-outline" onClick={downloadQRCode} />
      </Tooltip>
      <Tooltip title="Delete">
        <ActionIcon icon="eva:trash-2-outline" onClick={() => setDeleteCard(true)} />
      </Tooltip>
      <Dialog open={deleteCard} onClose={() => setDeleteCard(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Card Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this card?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDeleteCard(false)}>
            Cancel
          </Button>
          <LoadingButton loading={processDelete} onClick={() => handleDeleteCard(id)}>
            Yes
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <IconSnackbar open={cardDeleted} setOpen={setCardDeleted} title="Success" msg="Card has been deleted." />
    </CardActions>
  );
}

SocialShare.propTypes = {
  shareUrl: PropTypes.string,
  title: PropTypes.string,
};

function SocialShare({ shareUrl, title }) {
  return (
    <ShareIcons>
      <ShareIcon>
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </ShareIcon>
      <ShareIcon>
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </ShareIcon>
      <ShareIcon>
        <LinkedinShareButton url={shareUrl} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </ShareIcon>
      <ShareIcon>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </ShareIcon>
      <ShareIcon>
        <EmailShareButton url={shareUrl} title={title}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </ShareIcon>
    </ShareIcons>
  );
}

export default function ViewCard() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [cardDetails, setCardDetails] = useState([]);
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  const [catalogues, setCatalogues] = useState([]);
  const [cataloguesImages, setCatalogueImages] = useState([]);

  const [contentType, setContentType] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoMute = () => setIsMuted(!isMuted);

  const shareUrl = `${window.location.origin}/${cardDetails?.cardName}`;
  const title = 'Card9';

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setLinkCopied(false);
  };

  const EmailCardSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const cardAsImage = () => {
    const backgroundDom = document.getElementById('cardAsImage');
    backgroundDom.style.backgroundColor = '#fff';
    return htmlToImage.toJpeg(backgroundDom);
  };

  const emailFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: EmailCardSchema,
    onSubmit: async (values, actions) => {
      const cardImage = await cardAsImage();
      const newValues = Object.assign(values, {
        cardImage,
        cardName: cardDetails.cardName,
      });
      mailService.sendCard(newValues);
      resetForm();

      setTimeout(() => {
        actions.setSubmitting(false);
      }, 2000);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm } = emailFormik;

  const getIcon = (icon) => <Iconify icon={icon} width={22} height={22} />;

  useEffect(() => {
    setLoader(true);
    cardService.getOneCard(id).then((resp) => {
      let daysLeft = ExpDateChecker(resp.data.card.expiredAt);
      if (daysLeft <= 0) navigate('/app/cards');

      setCardDetails(resp.data.card);
      setImages(resp.data.images);
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (cardDetails?.id) {
      catalogueService.getAllCataloguesByCardId(cardDetails.id).then((resp) => {
        setCatalogues(resp.data.catalogues);
        setCatalogueImages(resp.data.images);
      });
    }
  }, [cardDetails]);

  useEffect(() => {
    if (images.profile) {
      let ext = extractExtensionFromBase64(images.profile);
      setContentType(ext);
    }
  }, [images]);

  return (
    <>
      <SEO title="View card" image={ogViewCard} />
      {cardDetails ? (
        <Page title={`${cardDetails.cardName}`}>
          <ColorRing
            visible={loader}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{ position: 'absolute', top: '40%', left: '40%' }}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
          {loader === false && (
            <Container maxWidth="xl">
              <ActionBar navigate={navigate} />
              <CardsView>
                <div id="cardAsImage" style={{ display: 'flex', justifyContent: 'center', width: 400 }}>
                  <PreviewCard theme={theme}>
                    {contentType === 'mp4' ? (
                      <>
                        <CardMedia
                          component="video"
                          height="385"
                          autoPlay
                          muted={isMuted}
                          loop
                          src={
                            images?.profile !== undefined ? images.profile : '/static/mock-images/avatars/avatar_1.jpg'
                          }
                          alt="avatar"
                          sx={{ userSelect: 'none', backgroundColor: cardDetails.theme }}
                        />
                        <ButtonIcon
                          variant="contained"
                          onClick={() => handleVideoMute()}
                          indicator={theme}
                          sx={{ top: 12, right: 24 }}
                        >
                          {getIcon('ant-design:sound-filled')}
                        </ButtonIcon>
                      </>
                    ) : (
                      <CardMedia
                        component="img"
                        height="385"
                        image={
                          images?.profile !== undefined ? images.profile : '/static/mock-images/avatars/avatar_1.jpg'
                        }
                        alt="avatar"
                        sx={{ userSelect: 'none', backgroundColor: cardDetails.theme }}
                      />
                    )}
                    <ClippedSVG color={cardDetails.theme} />
                    <CardLogo
                      component="img"
                      height="60"
                      image={images?.logo !== undefined ? images.logo : '/static/mock-images/avatars/avatar_1.jpg'}
                      alt="logo"
                    />
                    <CardContent sx={{ p: '0 !important' }}>
                      <BasicDetails sx={{ p: 3, pb: 1 }}>
                        <CardInfo>
                          <Typography
                            sx={{
                              fontSize: 28,
                              fontWeight: 'bold',
                              lineHeight: 1.4,
                            }}
                          >
                            {`${cardDetails?.prefix}${cardDetails?.firstName} ${cardDetails?.middleName} ${cardDetails?.lastName}`}
                          </Typography>
                          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{cardDetails.title}</Typography>
                          <Typography sx={{ fontSize: 20, fontWeight: 700, color: cardDetails.theme }}>
                            {cardDetails.department}
                          </Typography>
                          <Typography sx={{ fontSize: 20, fontStyle: 'italic' }}>{cardDetails.company}</Typography>
                        </CardInfo>
                        <Typography sx={{ my: 2, fontSize: 18, opacity: 0.8 }}>{cardDetails.headline}</Typography>
                      </BasicDetails>
                    </CardContent>
                    <List>
                      <ListItem disablePadding sx={{ cursor: 'none' }}>
                        <ListButton>
                          <ListIcon sx={{ backgroundColor: cardDetails.theme }}>
                            <Iconify icon="fa6-solid:envelope" width={22} height={22} />
                          </ListIcon>
                          <ListItemText primary={cardDetails.email} secondary="work" />
                        </ListButton>
                      </ListItem>
                      <ListItem disablePadding sx={{ cursor: 'none' }}>
                        <ListButton>
                          <ListIcon sx={{ backgroundColor: cardDetails.theme }}>
                            <Iconify icon="fa6-solid:mobile" width={22} height={22} />
                          </ListIcon>
                          <ListItemText primary={cardDetails.phone} secondary="mobile" />
                        </ListButton>
                      </ListItem>
                    </List>
                  </PreviewCard>
                </div>
                <SendCard sx={{ height: 'fit-content' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                      Send Card
                    </Typography>
                    {activeTab === 0 && (
                      <QRCodeTab>
                        <QRLink href={shareUrl} target="_blank" sx={{ py: 2 }}>
                          <QRCode value={shareUrl} logoImage={Logo} logoWidth="32" logoHeight="32" />
                          <Typography variant="body2">Scan or click to preview</Typography>
                        </QRLink>
                        <SocialShare shareUrl={shareUrl} title={title} />
                        <Button
                          variant="outlined"
                          startIcon={getIcon('fa6-regular:copy')}
                          onClick={() => {
                            copy(shareUrl);
                            setLinkCopied(true);
                          }}
                        >
                          Copy Link
                        </Button>
                        <IconSnackbar
                          open={linkCopied}
                          setOpen={setLinkCopied}
                          title="Success"
                          msg="The link to your card has been copied to the clipboard."
                        />
                      </QRCodeTab>
                    )}
                    {activeTab === 1 && (
                      <EmailCard>
                        <Typography sx={{ mb: 2 }}>Email your Work card to:</Typography>
                        <FormikProvider value={emailFormik}>
                          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                  fullWidth
                                  variant="standard"
                                  label="Name"
                                  {...getFieldProps('name')}
                                  error={Boolean(touched.name && errors.name)}
                                  helperText={touched.name && errors.name}
                                />
                              </Stack>

                              <TextField
                                fullWidth
                                variant="standard"
                                autoComplete="email"
                                type="email"
                                label="Email address"
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{ mt: '16px !important' }}
                              />

                              <TextField
                                fullWidth
                                variant="standard"
                                autoComplete="message"
                                type="message"
                                label="Message"
                                {...getFieldProps('message')}
                                sx={{ mt: '16px !important' }}
                                multiline
                                rows={3}
                              />

                              <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{ mt: '16px !important', background: cardDetails.theme }}
                                loading={isSubmitting}
                              >
                                Send
                              </LoadingButton>
                            </Stack>
                          </Form>
                        </FormikProvider>
                      </EmailCard>
                    )}
                    <CardTabs
                      value={activeTab}
                      onChange={handleTabChange}
                      TabIndicatorProps={{
                        style: {
                          display: 'none',
                        },
                      }}
                    >
                      <CardTab icon={getIcon('fa6-solid:qrcode')} label="Code" current={activeTab === 0 ? 1 : 0} />
                      <CardTab icon={getIcon('fa6-solid:envelope')} label="Email" current={activeTab === 1 ? 1 : 0} />
                    </CardTabs>
                  </CardContent>

                  {catalogues && catalogues.length > 0 ? (
                    <CardContent style={{ borderTop: `1px solid ${cardDetails.theme}` }}>
                      <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                        Catalogues
                      </Typography>
                      <CatalogueSection>
                        <div class="container scroll-1">
                          {catalogues.map((catalogue, index) => {
                            return (
                              <CatalogueCard
                                key={catalogue?.id}
                                catalogue={catalogue}
                                image={cataloguesImages ? cataloguesImages[index] : []}
                                color={cardDetails.theme}
                              />
                            );
                          })}
                        </div>
                      </CatalogueSection>
                    </CardContent>
                  ) : (
                    <></>
                  )}
                </SendCard>
              </CardsView>
            </Container>
          )}
        </Page>
      ) : (
        <> </>
      )}
    </>
  );
}
