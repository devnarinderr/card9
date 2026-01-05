// Helmet(SEO)
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import GoogleTagManager from './GoogleTagManager';

export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <ScrollToTop />
        <Router />
        <GoogleTagManager />
      </HelmetProvider>
    </ThemeProvider>
  );
}
