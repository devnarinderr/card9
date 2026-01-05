import { styled } from '@mui/material/styles';
import { Card, CardMedia, Grid, IconButton, TextField } from '@mui/material';
import Iconify from '../../../components/Iconify';
import CurvedSVG from '../../../components/CurvedSVG';

export const CardActions = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 16,
});

export const ActionIcon = styled(Iconify)(({ theme }) => ({
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  margin: '8px 16px',
  [theme.breakpoints.down('sm')]: {
    margin: '8px',
  },
}));

export const CardsView = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
}));

export const AddCard = styled(Card)(({ theme }) => ({
  width: 400,
  margin: '1rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  [theme.breakpoints.down('sm')]: {
    width: 360,
    margin: 'auto',
    marginBottom: 16,
  },
}));

export const Form = styled('form')({});

export const ProfileImage = styled('div')(({ color }) => ({
  backgroundColor: color,
  position: 'relative',
  height: '385px',
  overflow: 'hidden',
  userSelect: 'none',
}));

export const UploadImage = styled('label')(({ theme, background }) => ({
  display: 'block',
  background: `url(${background})`,
  backgroundColor: theme.palette.grey[200],
  backgroundRepeat: 'no-repeat',
  height: '100%',
  backgroundPosition: '30% bottom',
  backgroundSize: '60%',
  cursor: 'pointer',
}));

export const InputFile = styled('input')({
  display: 'none',
});

export const ClippedSVG = styled(CurvedSVG)({
  position: 'absolute',
  bottom: 0,
});

export const ButtonIcon = styled(IconButton)(({ indicator }) => ({
  position: 'absolute',
  background: indicator,
  color: '#fff',
  ':hover': {
    background: indicator,
  },
}));

export const UploadLogo = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'absolute',
  bottom: 0,
  right: 24,
  width: '60px',
  height: '60px',
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.grey[200],
  borderRadius: 8,
  cursor: 'pointer',
}));

export const CardLogo = styled(CardMedia)({
  position: 'absolute',
  bottom: 0,
  right: 24,
  width: '60px !important',
});

export const CardTheme = styled('div')({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const ColorButton = styled('div')(({ color, active }) => ({
  background: color,
  width: '1.25rem',
  height: '1.25rem',
  cursor: 'pointer',
  transition: '300ms ease 0s',
  borderRadius: '100%',
  margin: '0.5rem',
  transform: active && 'scale(1.5)',
  boxShadow: active && '#fff 0px 0px 0px 2px, rgb(0, 0, 0, 0.4) 0px 0px 0px 3px',
}));

export const BasicDetails = styled('div')({});

export const InfoBadges = styled('div')({});

export const InfoBadge = styled('div')({
  position: 'relative',
  display: 'flex',
});

export const InfoTextFields = styled('div')({});

export const RemoveIcon = styled('div')({
  marginTop: 12,
  height: 'fit-content',
  opacity: 0.5,
  cursor: 'pointer',
});

export const CustomTextField = styled(TextField)(({ theme, indicator }) => ({
  marginBottom: 1,
  '& .Mui-focused': {
    '&.MuiInputLabel-root': {
      color: indicator,
    },
    '&:after': {
      borderColor: indicator,
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '18rem',
    margin: 'auto',
  },
}));

export const InfoPicker = styled(Card)(({ theme, indicator }) => ({
  padding: 12,
  width: 400,
  height: 'fit-content',
  margin: '1rem',
  borderRadius: '0.5rem',
  backgroundColor: `${indicator}20`,
  [theme.breakpoints.down('sm')]: {
    width: 360,
    margin: 'auto',
  },
}));

export const GridItem = styled(Grid)({
  padding: 16,
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  ':hover svg': {
    transform: 'scale(1.1)',
  },
});
