import { styled } from '@mui/material/styles';
import { Card, IconButton, TextField, CardMedia, Grid } from '@mui/material';
import Iconify from '../../../components/Iconify';

export const CatalogActions = styled('div')({
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

export const CatalogsView = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
}));

export const AddCatalog = styled(Card)(({ theme }) => ({
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

export const CatalogImage = styled('div')(({ color }) => ({
  backgroundColor: color,
  position: 'relative',
  height: '385px',
  overflow: 'hidden',
  userSelect: 'none',
}));

export const ButtonIcon = styled(IconButton)(({ indicator }) => ({
  position: 'absolute',
  background: indicator,
  color: '#fff',
  ':hover': {
    background: indicator,
  },
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

export const CustomTextField = styled(TextField)(({ indicator }) => ({
  marginBottom: 1,
  '& .Mui-focused': {
    '&.MuiInputLabel-root': {
      color: indicator,
    },
    '&:after': {
      borderColor: indicator,
    },
  },
}));

export const CardSelector = styled('div')({});

export const CatalogueSwitchButton = styled('div')(({ theme }) => ({
  margin: '3px 24px',
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}));
