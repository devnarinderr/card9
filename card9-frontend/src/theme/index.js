import PropTypes from 'prop-types';
import { useMemo } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.systemProperties);

  const themeOptions = useMemo(
    () => ({
      palette: {
        mode: theme,
      },
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows,
    }),
    [theme]
  );

  const createNewTheme = createTheme(themeOptions);
  createNewTheme.components = componentsOverride(createNewTheme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={createNewTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
