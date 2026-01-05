import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardsContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});

export const CardContainer = styled('div')(({ theme, active }) => ({
  border: active && `2px solid ${theme.palette.primary.main}`,
  borderRadius: '0.5rem',
  '&:not(:last-child)': {
    marginRight: '1rem',
    marginBottom: '1rem',
  },
}));

export const BackgroundContainer = styled(Grid)({
  position: 'sticky',
  top: 100,
});

export const BackgroundPreview = styled('div')(({ theme, image }) => ({
  position: 'relative',
  maxWidth: '720px',
  width: '100%',
  height: '360px',
  color: '#fff',
  padding: 8,
  overflow: 'hidden',
  backgroundColor: !image && theme.palette.primary.main,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '300px',
  },
  canvas: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: '120px !important',
    height: '120px !important',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      width: '80px !important',
      height: '80px !important',
    },
  },
}));

export const CardDetails = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  display: 'flex',
  maxWidth: 'calc(100% - 140px)',
  padding: 7,
  backgroundColor: '#00000040',
  borderRadius: 8,
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'calc(100% - 100px)',
  },
}));

export const CardInfo = styled('div')({
  paddingLeft: 8,
  borderLeft: '1px dotted #fff',
  '&::before': {
    content: '""',
    height: '260%',
    width: '200%',
    position: 'absolute',
    bottom: '-80%',
    right: '-50%',
  },
});

export const LogoBox = styled(Box)(({ theme }) => ({
  width: 84,
  height: 84,
  marginRight: 12,
  objectFit: 'contain',
  borderRadius: 8,
  [theme.breakpoints.down('sm')]: {
    width: 48,
  },
}));

export const WatermarkText = styled(Typography)({
  position: 'absolute',
  right: 24,
  bottom: 16,
  backgroundColor: '#00000040',
  borderRadius: 5,
  padding: 5,
  userSelect: 'none',
  display: 'flex',
  '&::before': {
    content: '""',
    height: '260%',
    width: '400%',
    position: 'absolute',
    bottom: '-80%',
    right: '-120%',
  },
});

export const DownloadBackground = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const ImagesSection = styled('div')({});

export const ImagesContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});

export const ImageBox = styled(Box)(({ theme }) => ({
  height: 140,
  width: 248,
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  margin: 8,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));
