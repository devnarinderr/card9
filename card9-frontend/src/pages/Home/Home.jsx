import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Page from 'src/components/Page';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
// Import the mail service
import mailService from '../../services/mail.services';

// Styled components
const BannerSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(269deg, #d7d8e6 0%, rgba(255, 255, 255, 0) 100%), url(/images/260161.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
  padding: theme.spacing(4, 0),
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
}));

const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const PricingCard = styled(Card)(({ theme, popular }) => ({
  height: '100%',
  borderRadius: '0.5rem',
  border: '1px solid rgba(0, 0, 0, 0.07)',
  borderTop: popular ? '5px solid #d62956' : '5px solid #10E7DC',
  position: 'relative',
  boxShadow: theme.shadows[3],
}));

// Contact Form Wrapper
const ContactFormWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 99999,
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    overflowY: 'auto',
  },
}));

// Contact Left
const ContactLeft = styled(Box)(({ theme }) => ({
  width: '50%',
  height: '100%',
  backgroundImage: 'url(/images/333.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '40vh',
    minHeight: '200px',
  },
}));

// Contact Right
const ContactRight = styled(Box)(({ theme }) => ({
  width: '50%',
  height: '100%',
  backgroundImage: 'linear-gradient(to right, #ea5532, #d62956)',
  color: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    minHeight: '60vh',
  },
}));

// Custom Select Styles
const CustomSelectWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const CustomSelectButton = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '16.5px 14px',
  border: '1px solid rgba(255, 255, 255, 0.23)',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  color: 'white',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
}));

const CustomSelectDropdown = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#d62956',
  borderRadius: '4px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  maxHeight: '200px',
  overflowY: 'auto',
  marginTop: '4px',
}));

const CustomSelectOption = styled(Box)(({ theme, selected }) => ({
  padding: '12px 14px',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ...(selected && {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  }),
}));

// PDF Card Image Box
const PdfCardImage = styled(Box)(({ theme }) => ({
  minHeight: 300,
  backgroundImage: 'url(/images/50.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  [theme.breakpoints.down('md')]: {
    minHeight: 250,
  },
}));

// Online Card Image Box
const OnlineCardImage = styled(Box)(({ theme }) => ({
  minHeight: 300,
  backgroundImage: 'url(/images/51.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  [theme.breakpoints.down('md')]: {
    minHeight: 250,
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    contact: '',
    price: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle click outside to close price dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPriceDropdownOpen) {
        // Check if click is outside the custom select
        const selectWrapper = document.querySelector('[data-custom-select]');
        if (selectWrapper && !selectWrapper.contains(event.target)) {
          setIsPriceDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPriceDropdownOpen]);
  
  // Debug form state changes
  useEffect(() => {
    console.log('Form state updated:', contactForm);
  }, [contactForm]);
  
  // Handle form input changes
  const handleInputChange = (name, value) => {
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!contactForm.contact.trim()) errors.contact = 'Contact is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Send form data to backend
      const response = await mailService.contactLead(contactForm);
      
      if (response && response.data && response.data.msg) {
        setSnackbar({
          open: true,
          message: response.data.msg,
          severity: 'success'
        });
        
        // Reset form
        setContactForm({
          name: '',
          email: '',
          contact: '',
          price: '',
          message: ''
        });
        
        // Close form after success
        setTimeout(() => {
          closeContactForm();
        }, 2000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Open contact form
  const openContactForm = (priceOption = '') => {
    setContactForm(prev => ({
      ...prev,
      price: priceOption
    }));
    setIsContactFormOpen(true);
  };
  
  // Close contact form
  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };
  
  // Handle pricing button clicks
  const handlePricingClick = (priceValue) => {
    openContactForm(priceValue);
  };
  
  return (
    <Page title="Business card, Pdf card, Make Digital business card online">
      <Helmet>
        {/* External CSS files */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/css/animate.css" />
        
        <meta name="description" content="Make Digital business card online, Business card, Pdf card, Your digital business card is available online and send anywhere in globe" />
        <meta name="keywords" content="business card, business cards, pdf card, online pdf card, business card maker, business card template, digital business card, business card design, digital business card free, digital business card no app, your digital business card, online business card maker, digital card, online business card generator, online business cards cheap, best online business card maker, business card buy online, make business cards at home" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="image" content="https://card9.me/home/images/large-logo.png" />
        
        {/* Schema.org for Google */}
        <meta itemprop="name" content="Business card, Pdf card, Make Digital business card online" />
        <meta itemprop="description" content="Make Digital business card online, Business card, Pdf card, Your digital business card is available online and send anywhere in globe" />
        <meta itemprop="image" content="https://card9.me/home/images/large-logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Business card, Pdf card, Make Digital business card online" />
        <meta name="twitter:description" content="Make Digital business card online, Business card, Pdf card, Your digital business card is available online and send anywhere in globe" />
        <meta name="twitter:creator" content="@evolvan" />
        <meta name="twitter:image:src" content="http://card9.me/home/images/large-logo.png" />
        
        {/* Open Graph general (Facebook, Pinterest & Google+) */}
        <meta name="og:title" content="Business card, Pdf card, Make Digital business card online" />
        <meta name="og:description" content="Make Digital business card online, Business card, Pdf card, Your digital business card is available online and send anywhere in globe" />
        <meta name="og:image" content="https://card9.me/home/images/large-logo.png" />
        <meta name="og:url" content="http://card9.me/" />
        <meta name="og:site_name" content="Card9" />
        <meta name="og:type" content="website" />
      </Helmet>
      
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: scrolled ? 'white' : 'transparent', 
          boxShadow: scrolled ? '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)' : 'none',
          transition: 'background-color 0.3s, box-shadow 0.3s'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box component="img" src="/images/logo.png" alt="logo" sx={{ width: 130 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              sx={{ 
                borderRadius: '30px', 
                backgroundColor: 'rgba(0,0,0,0.1)', 
                color: 'black',
                borderColor: 'rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderColor: 'rgba(0,0,0,0.2)',
                }
              }}
              onClick={() => document.getElementById('pricingsection').scrollIntoView({ behavior: 'smooth' })}
            >
              Pricing
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                borderRadius: '30px',
                backgroundColor: '#d62956',
                '&:hover': {
                  backgroundColor: '#c1254d',
                }
              }}
              onClick={() => openContactForm()}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Banner Section */}
      <BannerSection>
        <Container maxWidth="lg"  sx={{ pt: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h6" sx={{ fontSize: '18px', letterSpacing: '3px', mb: 2 }}>
                  CARD9 - GLOBALIZING IDENTITIES
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '28px', sm: '35px', md: '40px' }, fontWeight: 'bold', mb: 3 }}>
                  CARD9 enables you to easily distribute and display your Business card with a professional impression.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: '30px',
                    backgroundColor: '#d62956',
                    padding: '10px 45px',
                    fontSize: '15px',
                    letterSpacing: '2px',
                    boxShadow: '2px 3px 8px rgba(67, 66, 66, 0.36)',
                    '&:hover': {
                      backgroundColor: '#c1254d',
                    }
                  }}
                  onClick={() => openContactForm()}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Box 
                component="img" 
                src="/images/banner-img.png" 
                alt="banner" 
                sx={{ 
                  width: { xs: '80%', sm: '70%', md: '100%' }, 
                  maxWidth: 300,
                  transform: 'rotate(339deg)',
                  WebkitBoxReflect: 'below -46px linear-gradient(to bottom, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.21))'
                }} 
              />
            </Grid>
          </Grid>
        </Container>
      </BannerSection>
      
      {/* PDF Card Section */}
      <SectionWrapper sx={{ backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ fontSize: '40px', letterSpacing: '3px', mb: 3 }}>
                  PDF Card
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '18px', letterSpacing: '3px', mb: 2 }}>
                  A Digital Business card in the form of PDF.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '20px', mb: 3 }}>
                  Cost-Effective, Quick & Easy Access, and Easy to Share. Unlimited supply of an elegant and effective business card at your fingertips.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: '30px',
                    backgroundColor: '#10E7DC',
                    padding: '10px 45px',
                    fontSize: '15px',
                    letterSpacing: '2px',
                    boxShadow: '2px 3px 8px rgba(67, 66, 66, 0.36)',
                    '&:hover': {
                      backgroundColor: '#0dc5bb',
                    }
                  }}
                  onClick={() => handlePricingClick('₹1200 - ₹2000')}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 }, textAlign: 'center' }}>
              {/* PDF Card Image */}
              <PdfCardImage />
            </Grid>
          </Grid>
        </Container>
      </SectionWrapper>
      
      {/* Online Card Section */}
      <SectionWrapper>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              {/* Online Card Image */}
              <OnlineCardImage />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Typography variant="h3" sx={{ fontSize: '40px', letterSpacing: '3px', mb: 3 }}>
                  Online Card
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '18px', letterSpacing: '3px', mb: 2 }}>
                  A Digital Business Card for 24x7x365 availability!
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '20px', mb: 3 }}>
                  Available around the clock and around the globe. Share within seconds and remain there forever.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: '30px',
                    backgroundColor: '#10E7DC',
                    padding: '10px 45px',
                    fontSize: '15px',
                    letterSpacing: '2px',
                    boxShadow: '2px 3px 8px rgba(67, 66, 66, 0.36)',
                    '&:hover': {
                      backgroundColor: '#0dc5bb',
                    }
                  }}
                  onClick={() => handlePricingClick('₹1200')}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </SectionWrapper>
      
      {/* Testimonials Section */}
      <SectionWrapper sx={{ backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontSize: '40px', letterSpacing: '3px', textAlign: 'center', mb: 5 }}>
            Testimonials
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card sx={{ textAlign: 'center', padding: 2, height: '100%' }}>
                  <Box 
                    component="img" 
                    src={`/images/user${item}.png`} 
                    alt={`user${item}`} 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      margin: '0 auto 16px',
                      boxShadow: 3
                    }} 
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item === 1 && 'Leonie Lange'}
                    {item === 2 && 'Robert R.'}
                    {item === 3 && 'David Morrow'}
                    {item === 4 && 'Sandy J.'}
                  </Typography>
                  <Typography variant="body2">
                    {item === 1 && '"I would like to personally thank you for your outstanding product. Keep up the excellent work."'}
                    {item === 2 && '"I STRONGLY recommend CARD9 to EVERYONE interested in running a successful online business! We\'ve seen amazing results already. Digital cards is the real deal!"'}
                    {item === 3 && '"Not able to tell you how happy I am with CARD9. Definitely worth the investment."'}
                    {item === 4 && '"Digital cards saved my business. These exactly what our business has been lacking. I am so pleased with this product."'}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>
      
      {/* Pricing Section */}
      <SectionWrapper id="pricingsection" sx={{ backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontSize: '40px', letterSpacing: '3px', textAlign: 'center', mb: 5 }}>
            Pricing
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <PricingCard popular={false}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Online Digital Card
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    ₹1200 <small style={{ fontSize: '1rem' }}>annually</small>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    You will be billed annually
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      borderRadius: '30px',
                      backgroundColor: '#10E7DC',
                      padding: '10px',
                      fontSize: '15px',
                      letterSpacing: '2px',
                      '&:hover': {
                        backgroundColor: '#0dc5bb',
                      }
                    }}
                    onClick={() => handlePricingClick('₹1200')}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </PricingCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <PricingCard popular={true}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Digital Card (PDF)
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    ₹1200 - ₹2000 <small style={{ fontSize: '1rem' }}>One time</small>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Only One time payment. No hidden cost
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      borderRadius: '30px',
                      backgroundColor: '#d62956',
                      padding: '10px',
                      fontSize: '15px',
                      letterSpacing: '2px',
                      '&:hover': {
                        backgroundColor: '#c1254d',
                      }
                    }}
                    onClick={() => handlePricingClick('₹1200')}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </PricingCard>
            </Grid>
          </Grid>
        </Container>
      </SectionWrapper>
      
      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <ContactFormWrapper>
          {!isMobile && <ContactLeft />}
          <ContactRight>
            <IconButton 
              sx={{ position: 'absolute', top: 16, right: 16 }} 
              onClick={closeContactForm}
            >
              <Box component="img" src="/images/multiply.png" alt="close" sx={{ width: 24, height: 24 }} />
            </IconButton>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, pb: 4 }}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={contactForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
              <TextField
                fullWidth
                label="Contact No *"
                name="contact"
                value={contactForm.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                error={!!formErrors.contact}
                helperText={formErrors.contact}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
              {/* Custom Select for Price */}
              <CustomSelectWrapper data-custom-select>
                <Typography 
                  component="label" 
                  sx={{ 
                    color: 'white', 
                    fontSize: '12px', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontWeight: 400
                  }}
                >
                  Select Price
                </Typography>
                <CustomSelectButton onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}>
                  <span>{contactForm.price || 'Select Price'}</span>
                  <span>▼</span>
                </CustomSelectButton>
                {isPriceDropdownOpen && (
                  <CustomSelectDropdown>
                    <CustomSelectOption 
                      onClick={() => {
                        handleInputChange('price', '');
                        setIsPriceDropdownOpen(false);
                      }}
                      selected={!contactForm.price}
                    >
                      Select Price
                    </CustomSelectOption>
                    <CustomSelectOption 
                      onClick={() => {
                        handleInputChange('price', '₹1200');
                        setIsPriceDropdownOpen(false);
                      }}
                      selected={contactForm.price === '₹1200'}
                    >
                      ₹1200
                    </CustomSelectOption>
                    <CustomSelectOption 
                      onClick={() => {
                        handleInputChange('price', '₹1200 - ₹2000');
                        setIsPriceDropdownOpen(false);
                      }}
                      selected={contactForm.price === '₹1200 - ₹2000'}
                    >
                      ₹1200 - ₹2000
                    </CustomSelectOption>
                  </CustomSelectDropdown>
                )}
              </CustomSelectWrapper>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={contactForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
              <Button 
                type="submit"
                variant="contained" 
                fullWidth
                sx={{ 
                  borderRadius: '30px',
                  backgroundColor: 'white',
                  color: '#d62956',
                  padding: '12px',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </ContactRight>
        </ContactFormWrapper>
      )}
      
      {/* Footer */}
     <Box sx={{ backgroundColor: '#333', color: 'white', py: 4 }}>
  <Container maxWidth="lg">
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Logo */}
      <Grid item xs={12} md="auto" textAlign={{ xs: 'center', md: 'left' }}>
        <Box
          component="img"
          src="/images/logo.png"
          alt="logo"
          sx={{ width: 130 }}
        />
      </Grid>

      {/* Buttons */}
      <Grid
        item
        xs={12}
        md="auto"
        container
        spacing={2}
        justifyContent={{ xs: 'center', md: 'flex-end' }}
      >
        <Grid item>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '30px',
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: 'lightgray' },
            }}
            onClick={() =>
              document
                .getElementById('pricingsection')
                .scrollIntoView({ behavior: 'smooth' })
            }
          >
            Pricing
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '30px',
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: 'lightgray' },
            }}
            onClick={openContactForm}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>

      {/* Footer text */}
      <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} All Rights Reserved | Made with ❤️ by Evolvan
        </Typography>
      </Grid>
    </Grid>
  </Container>
</Box>

      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default Home;