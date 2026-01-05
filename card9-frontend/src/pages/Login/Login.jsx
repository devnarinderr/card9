import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { Link, Container, Typography } from '@mui/material';
import { RootStyle, HeaderStyle, SectionStyle, ContentStyle } from './LoginStyles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
// sections
import { LoginForm } from '../../sections/auth/login';
import SEO from '../../common/seo';
import ogLogin from '../../assets/images/ogImages/ogLogin.png';

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loginScreen, setLoginScreen] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setLoginScreen(true);
    }
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [loginScreen]);

  return (
    <Page title="Login">
      <SEO title="Login" image={ogLogin} />
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in to Card9
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
