import { useState } from 'react';
import { useSelector } from 'react-redux';
// library
import { QRCode } from 'react-qrcode-logo';
import * as htmlToImage from 'html-to-image';
// @mui
import { Button, Container, Grid, Typography } from '@mui/material';
import {
  CardsContainer,
  CardContainer,
  BackgroundContainer,
  BackgroundPreview,
  CardDetails,
  CardInfo,
  LogoBox,
  WatermarkText,
  DownloadBackground,
  ImagesSection,
  ImagesContainer,
  ImageBox,
} from './BackgroundStyles';
// components
import Page from '../../components/Page';
import ProfileCard from '../../components/ProfileCard';
import images from '../../assets/images.json';
import Logo from '../../assets/images/Logo-33x33.png';

export default function Background() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const { cardData } = useSelector((state) => state.card);
  const shareUrl = `${window.location.origin}/card/${cardData.card.id}`;

  const downloadBackground = (name) => {
    const backgroundDom = document.getElementById('virtualBackground');
    htmlToImage.toJpeg(backgroundDom).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${name}.jpeg`;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <Page title="Virtual Backgrounds">
      <Container maxWidth="xl">
        <CardsContainer>
          <CardContainer onClick={() => setSelectedCard(0)} active={selectedCard === 0 ? 1 : 0}>
            <ProfileCard small cardData={cardData.card} image={cardData.images} />
          </CardContainer>
        </CardsContainer>
        <BackgroundContainer container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={7} id="virtualBackground">
            <BackgroundPreview image={selectedImage}>
              <CardDetails>
                <LogoBox component="img" alt="logo" src={cardData.images.profile} />
                <CardInfo>
                  <Typography
                    variant="span"
                    sx={{
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {`${cardData.card.firstName}  ${cardData.card.lastName}`}
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontStyle: 'italic' }}>{cardData.card.title}</Typography>
                  <Typography sx={{ fontSize: 12, fontStyle: 'italic' }}>{cardData.card.department}</Typography>
                  <Typography sx={{ fontSize: 12, fontStyle: 'italic' }}>{cardData.card.company}</Typography>
                </CardInfo>
              </CardDetails>
              <QRCode value={shareUrl} logoImage={Logo} logoWidth="32" logoHeight="32" />
              <WatermarkText variant="caption">
                Card9 <img src={Logo} alt="img" width="20" height="20" style={{ marginLeft: 5 }} />{' '}
              </WatermarkText>
            </BackgroundPreview>
          </Grid>
          <Grid item xs={12} md={5}>
            <DownloadBackground>
              <Button
                variant="contained"
                sx={{
                  width: 250,
                  height: 48,
                }}
                onClick={() => downloadBackground(cardData.card.cardName)}
              >
                Download
              </Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Your custom background will save as a 1920x1080 image.
              </Typography>
            </DownloadBackground>
          </Grid>
        </BackgroundContainer>
        <ImagesSection sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Background
          </Typography>
          <ImagesContainer>
            {images.map((image, index) => (
              <ImageBox
                key={index}
                component="img"
                loading="lazy"
                alt={index}
                src={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </ImagesContainer>
        </ImagesSection>
      </Container>
    </Page>
  );
}
