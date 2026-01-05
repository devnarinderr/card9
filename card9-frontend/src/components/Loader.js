import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

Loader.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool
};

export default function Loader({ open, setOpen }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => setOpen(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
