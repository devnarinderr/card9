import { styled } from '@mui/material/styles';

export const MostPopularTitle = styled('div')(({ theme }) => ({
  marginTop: '10px',
  borderRadius: '20px',
  width: 'fit-content',
  height: 'fit-content',
  padding: '5px 10px',
  color: 'white',
}));

export const PricingBox = styled('div')(({ theme }) => ({
  width: '100%',
  height: '130px',
  backgroundColor: '#ecf0f1',
  textAlign: 'center',
  padding: '1rem',
}));

export const FeaturesList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  marginTop: '.8rem',
}));

export const ButtonContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '1rem',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

export const BuyNowButton = styled('button')(({ theme, color }) => ({
  width: '80%',
  padding: '.5rem',
  background: 'transparent',
  border: `1px solid ${color}`,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: color,
    color: 'white',
  },
}));
