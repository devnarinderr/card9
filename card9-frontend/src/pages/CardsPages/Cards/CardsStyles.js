import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const CardsContainer = styled(Container)({
  display: 'flex',
  flexWrap: 'wrap',
});

export const LoaderContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '40%',
  [theme.breakpoints.down('sm')]: {
    left: '38%',
    top: '50%',
  },
}));

export const AddCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 200,
  height: 240,
  margin: '1rem',
  color: theme.palette.primary.main,
  background: theme.palette.grey[200],
  border: `2px dotted ${theme.palette.primary.main}`,
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: '300ms ease 0s',
  textDecoration: 'none',
  ':hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    margin: 'auto',
    marginBottom: 16,
  },
}));

export const CardContainer = styled('div')(({ theme }) => ({
  margin: '1rem',
  cursor: 'pointer',
  transition: '300ms ease 0s',
  ':hover': {
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    margin: 'auto',
    marginBottom: 16,
  },
}));

export const WarningBox = styled('div')(({ theme }) => ({
  background: '#fefcf0',
  maxWidth: '60%',
  display: 'flex',
  marginLeft: '2.5rem',
  borderRadius: 10,
  alignItems: 'center',
  padding: 5,
  marginBottom: 10,
  [theme.breakpoints.down('sm')]: {
    margin: 'auto',
    marginBottom: 16,
  },
}));
