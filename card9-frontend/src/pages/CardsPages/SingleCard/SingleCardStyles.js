import { styled } from '@mui/material/styles';
import { Card, CardMedia, Link, ListItemButton, ListItemIcon, IconButton } from '@mui/material';
import CurvedSVG from '../../../components/CurvedSVG';

export const ClippedSVG = styled(CurvedSVG)({
  position: 'absolute',
  top: 305,
  width: '100%',
});

export const CardLogo = styled(CardMedia)({
  position: 'absolute',
  width: '60px !important',
  top: 325,
  right: 24,
});

export const PreviewCard = styled(Card)(({ theme, cardresize }) => ({
  width: '100%',
  margin: 'auto',
  borderRadius: '0.8rem',
  textDecoration: 'none',
  transition: 'width 0.3s ease-in-out, left 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    width: cardresize,
  },
}));

export const CardInfo = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  borderLeft: '1px dashed',
  borderColor: theme.palette.primary.main,
}));

export const GoesByInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const BasicDetails = styled('div')({});

export const ListButton = styled(ListItemButton)(({ theme }) => ({
  padding: '8px 24px',
  ':focus': {
    background: theme.palette.primary.lighter,
  },
}));

export const ListIcon = styled(ListItemIcon)(({ theme }) => ({
  padding: 8,
  marginRight: 16,
  borderRadius: '50%',
  minWidth: 'unset',
  color: '#fff',
  background: theme.palette.primary.main,
}));

export const FixedLink = styled(Link)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '2rem 2rem 0 0',
  fontSize: '0.75rem',
  lineHeight: '2rem',
  maxWidth: '400px',
  width: '100%',
  opacity: '0.85',
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '360px',
  },
}));

export const QRCodeTab = styled('div')({
  textAlign: 'center',
});

export const QRLink = styled(Link)(({ theme }) => ({
  display: 'block',
  color: theme.palette.primary.main,
  textDecoration: 'none',
}));

export const ButtonIcon = styled(IconButton)(({ indicator }) => ({
  position: 'absolute',
  background: indicator,
  color: '#fff',
  ':hover': {
    background: indicator,
  },
}));
