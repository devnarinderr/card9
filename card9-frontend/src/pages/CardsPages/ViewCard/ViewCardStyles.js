import { styled } from '@mui/material/styles';
import { Card, CardMedia, Link, ListItemButton, ListItemIcon, Tab, Tabs, IconButton } from '@mui/material';
import Iconify from '../../../components/Iconify';
import CurvedSVG from '../../../components/CurvedSVG';

export const CardActions = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

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

export const ClippedSVG = styled(CurvedSVG)({
  position: 'absolute',
  top: 305,
});

export const CardLogo = styled(CardMedia)({
  position: 'absolute',
  width: '60px !important',
  top: 325,
  right: 24,
});

export const PreviewCard = styled(Card)(({ theme }) => ({
  width: '100%',
  margin: '1rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  [theme.breakpoints.down('sm')]: {
    width: 360,
    margin: 'auto',
    marginBottom: 16,
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

export const BasicDetails = styled('div')({});

export const SendCard = styled(Card)(({ theme }) => ({
  width: 380,
  margin: '1rem',
  borderRadius: '0.5rem',
  [theme.breakpoints.down('md')]: {
    width: 400,
  },
  [theme.breakpoints.down('sm')]: {
    width: 360,
    margin: 'auto',
  },
}));

export const CardTabs = styled(Tabs)(({ theme }) => ({
  marginTop: 22,
  border: '2px solid',
  borderColor: theme.palette.primary.main,
  borderRadius: 10,
  height: 64,
}));

export const CardTab = styled(Tab)(({ theme, current }) => ({
  flex: 1,
  color: current ? '#fff !important' : theme.palette.primary.main,
  background: current && theme.palette.primary.main,
  minHeight: 'unset',
  ':not(:last-child)': {
    borderRight: '2px solid',
    borderColor: theme.palette.primary.main,
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

export const ShareIcons = styled('div')({
  padding: '0 0 8px',
});

export const ShareIcon = styled('span')({
  display: 'inline-block',
  margin: '0 4px',
});

export const EmailCard = styled('div')({});

export const CatalogueSection = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

export const ButtonIcon = styled(IconButton)(({ indicator }) => ({
  position: 'absolute',
  background: indicator,
  color: '#fff',
  ':hover': {
    background: indicator,
  },
}));
