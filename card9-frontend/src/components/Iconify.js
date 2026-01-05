import { forwardRef } from 'react';
import PropTypes from 'prop-types';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, sx, ...other }, ref) => (
  <Box component={Icon} icon={icon} sx={{ ...sx }} ref={ref} {...other} />
));

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

export default Iconify;