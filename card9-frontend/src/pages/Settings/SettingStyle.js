import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';


export const SettingCard = styled(Card)({
    height: '100%',
    padding: 0,
    marginBottom: 24,
    borderRadius: '0.5rem'
  });
  
export const CardTitle = styled(CardHeader)({
    padding: 16,
    paddingBottom: 8,
    userSelect: 'none'
  });
  
export const CardClickArea = styled(CardHeader)({
    padding: 16,
    'span.MuiCardHeader-title': {
      fontWeight: 500
    },
    '.MuiCardHeader-action': {
      alignSelf: 'unset'
    }
  });
  
export const CardClickAreas = styled(CardClickArea)({
    'span.MuiCardHeader-title': {
      fontWeight: 'unset',
      fontSize: '1rem'
    },
  });
  
export const Form = styled('form')({});
  
export const InputFile = styled('input')({
    display: 'none'
  });