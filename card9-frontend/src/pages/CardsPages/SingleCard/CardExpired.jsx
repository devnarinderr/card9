import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

const ContactPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Card Expired
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please contact{' '}
          <a style={{ textDecoration: 'none' }} href="www.card9.me">
            Card9.me
          </a>{' '}
          to renew your card.
        </Typography>
        <Box mt={3}>
          <a href="mailto:info@card9.me">
            <Button variant="contained" color="primary" style={{ marginRight: 10 }}>
              Email
            </Button>
          </a>
          <a href={`https://api.whatsapp.com/send?phone=`}>
            <Button variant="contained" color="primary">
              WhatsApp
            </Button>
          </a>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;
