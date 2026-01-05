import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { ColorRing } from 'react-loader-spinner';
// @mui
import {
  Box,
  CardContent,
  CardMedia,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Fab,
} from '@mui/material';
import {
  ClippedSVG,
  CardLogo,
  PreviewCard,
  CardInfo,
  BasicDetails,
  ListButton,
  ListIcon,
  FixedLink,
  ButtonIcon,
} from './SingleCardStyles';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import cardService from '../../../services/card.services';
import SEO from '../../../common/seo';
import IconSnackbar from '../../../components/IconSnackbar';
import SaveCard from './SaveCard';
import catalogueService from 'src/services/catalogue.services';
import CatalogueAccordation from './CatalogueAccordation';
import { ExpDateChecker } from 'src/common/cardExp';
import CardExpired from './CardExpired';

export default function SingleCard() {
  const theme = useTheme();
  const { name } = useParams();
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState([]);
  const [images, setImages] = useState('');
  const [catalogueData, setCatalogueData] = useState(null);
  const [catalogueImages, setCatalogueImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardresize, setCardResize] = useState(360);
  const [cardExp, setCardExp] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const handleVideoMute = () => setIsMuted(!isMuted);

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }, [success]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getIcon = (icon) => <Iconify icon={icon} width={22} height={22} />;
  const getEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoader(true);
        const resp = await cardService.getOneCard(name);

        if (resp !== undefined) {
          const daysLeft = ExpDateChecker(resp.data.card.expiredAt);
          if (daysLeft <= 0) setCardExp(true);

          setCardDetails(resp.data.card);
          setIsVideo(resp.data.card.isVideoProfile);
          setImages(resp.data.images);

          const response = await catalogueService.getAllCataloguesByCardId(resp.data.card.id);
          setCatalogueData(response.data.catalogues);
          setCatalogueImages(response.data.images);
        } else {
          navigate('not-found');
        }
      } catch (error) {
        console.error('Error fetching card details or catalogues:', error);
      } finally {
        setLoader(false);
      }
    };

    fetchCardDetails();
  }, []);
  const cardAsImage = () => {
    const backgroundDom = document.getElementById('cardAsImage');
    backgroundDom.style.backgroundColor = '#fff';
    return htmlToImage.toJpeg(backgroundDom);
  };

  useEffect(() => {
    const scrollListener = (e) => {
      if (window.pageYOffset >= 0) {
        setCardResize(360);
      }
      if (window.pageYOffset >= 30) {
        setCardResize(390);
      }
    };

    window.addEventListener('scroll', scrollListener, false);
    return () => window.removeEventListener('scroll', scrollListener, false);
  }, [cardresize]);

  return (
    <>
      {cardExp ? (
        <CardExpired />
      ) : (
        <Page title={cardDetails ? cardDetails.cardName : ''}>
          <SEO
            title={
              cardDetails
                ? `${cardDetails?.prefix}${cardDetails?.firstName} ${cardDetails?.middleName} ${cardDetails?.lastName}`
                : 'Card9.me'
            }
            description={cardDetails?.headline}
            image={images?.profile}
          />
          <IconSnackbar
            open={success}
            setOpen={setSuccess}
            type={'success'}
            title={'Success'}
            msg="Card send successfully."
          />
          <ColorRing
            visible={loader}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{ position: 'absolute', top: '40%', left: '45%' }}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
          {loader === false && (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
              <SaveCard
                setSuccess={setSuccess}
                open={open}
                handleClose={handleClose}
                color={cardDetails?.theme}
                cardName={cardDetails?.cardName}
                vcfName={cardDetails?.firstName}
                cardAsImage={cardAsImage}
              />
              <div id="cardAsImage" style={{ width: 400, paddingTop: '1rem' }}>
                <PreviewCard cardresize={cardresize}>
                  {isVideo ? (
                    <>
                      <CardMedia
                        component="video"
                        height="385"
                        src={
                          images?.profile !== undefined ? images.profile : '/static/mock-images/avatars/avatar_1.jpg'
                        }
                        muted={isMuted}
                        autoPlay
                        loop
                        alt="avatar"
                        sx={{ userSelect: 'none', backgroundColor: cardDetails ? cardDetails.theme : '' }}
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
                      sx={{ userSelect: 'none', backgroundColor: cardDetails ? cardDetails.theme : '' }}
                    />
                  )}
                  <ClippedSVG color={cardDetails ? cardDetails.theme : 'red'} />
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
                        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                          {cardDetails ? cardDetails.title : ''}
                        </Typography>
                        <Typography sx={{ fontSize: 20, fontWeight: 700, color: cardDetails?.theme }}>
                          {cardDetails ? cardDetails.department : ''}
                        </Typography>
                        <Typography sx={{ fontSize: 20, fontStyle: 'italic' }}>
                          {cardDetails ? cardDetails.company : ''}
                        </Typography>
                      </CardInfo>
                      <Typography sx={{ my: 2, fontSize: 18, opacity: 0.8 }}>
                        {cardDetails ? cardDetails.headline : ''}
                      </Typography>
                    </BasicDetails>
                  </CardContent>
                  <List>
                    {cardDetails.email ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`mailto:${cardDetails ? cardDetails.email : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('fa6-solid:envelope')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.email : ''} secondary="work" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.phone ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`tel:${cardDetails ? cardDetails.phone : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('fa6-solid:phone')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.phone : ''} secondary="work" />
                        </ListButton>
                      </ListItem>
                    ) : null}
                    {cardDetails.whatsapp ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://api.whatsapp.com/send?phone=${cardDetails ? cardDetails.whatsapp : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:whatsapp')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.whatsapp : ''} secondary="whatsapp" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.website ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://${cardDetails ? cardDetails.website : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:web')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.website : ''} secondary="website" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.linkedin ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://www.linkedin.com/in/${cardDetails ? cardDetails.linkedin : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:linkedin')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.linkedin : ''} secondary="linkedin" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.github ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://github.com/${cardDetails ? cardDetails.github : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:github')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.github : ''} secondary="github" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.skype ? (
                      <ListItem disablePadding sx={{ textDecoration: 'none', color: '#000' }} component={Link} href="#">
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:skype')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.skype : ''} secondary="skype" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.address ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={cardDetails.addressUrl}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:map-marker')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.address : ''} secondary="address" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.twitter ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://twitter.com/${cardDetails ? cardDetails.twitter : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:twitter')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.twitter : ''} secondary="twitter" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.youtube ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https:/${cardDetails ? cardDetails.youtube : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:youtube')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.youtube : ''} secondary="youtube" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.instagram ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://instagram.com/${cardDetails ? cardDetails.instagram : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:instagram')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.instagram : ''} secondary="instagram" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.facebook ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https://facebook.com/${cardDetails ? cardDetails.facebook : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:facebook')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.facebook : ''} secondary="facebook" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.snapchat ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https:/${cardDetails ? cardDetails.snapchat : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:snapchat')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.snapchat : ''} secondary="snapchat" />
                        </ListButton>
                      </ListItem>
                    ) : null}

                    {cardDetails.link ? (
                      <ListItem
                        disablePadding
                        sx={{ textDecoration: 'none', color: '#000' }}
                        component={Link}
                        href={`https:/${cardDetails ? cardDetails.link : ''}`}
                        target="_blank"
                      >
                        <ListButton>
                          <ListIcon sx={{ background: cardDetails?.theme ? cardDetails?.theme : 'blue' }}>
                            {getIcon('mdi:link-variant')}
                          </ListIcon>
                          <ListItemText primary={cardDetails ? cardDetails.link : ''} secondary="link" />
                        </ListButton>
                      </ListItem>
                    ) : null}
                  </List>

                  {/* youtube attachment */}
                  {cardDetails.yotubeattachment ? (
                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: 28,
                          fontWeight: 'bold',
                          lineHeight: 1.4,
                        }}
                      >
                        Attachments
                      </Typography>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          paddingTop: '56.25%',
                        }}
                      >
                        <Box
                          component="iframe"
                          src={getEmbedUrl(cardDetails.yotubeattachment)}
                          title="YouTube video player"
                          sx={{
                            loading: 'lazy',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                            borderRadius: 2,
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>{null}</>
                  )}

                  {/*  */}
                </PreviewCard>
                {catalogueData && catalogueData.length > 0 ? (
                  <CatalogueAccordation
                    color={cardDetails?.theme}
                    catalogueData={catalogueData}
                    images={catalogueImages}
                  />
                ) : (
                  <></>
                )}
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    [theme.breakpoints.down('sm')]: {
                      height: 120,
                    },
                  }}
                />
              </div>

              <Fab
                onClick={() => handleClickOpen()}
                variant="extended"
                sx={{
                  margin: 0,
                  top: 'auto',
                  bottom: 50,
                  position: 'fixed',
                  background: cardDetails ? cardDetails.theme : 'red',
                  color: 'white',
                  '&:hover': {
                    color: cardDetails ? cardDetails.theme : 'black',
                  },
                }}
              >
                Save Contact
              </Fab>
              <FixedLink href="http://card9.me" sx={{ background: cardDetails ? cardDetails.theme : 'red' }}>
                A digital business card from Card9.
              </FixedLink>
            </Container>
          )}
        </Page>
      )}
    </>
  );
}
