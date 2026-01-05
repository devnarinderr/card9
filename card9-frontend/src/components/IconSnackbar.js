import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from './Iconify';

// ----------------------------------------------------------------------

IconSnackbar.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  msg: PropTypes.string,
  type: PropTypes.string
};

export default function IconSnackbar({ open, setOpen, title, msg, type="success" }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity={type}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Iconify icon='clarity:times-circle-line' width={22} height={22} />
          </IconButton>
        }
        sx={{textAlign: 'left'}}
      >
        <AlertTitle sx={{m: 0}}>{title}</AlertTitle>
        {msg}
      </Alert>
    </Snackbar>
  );
}
