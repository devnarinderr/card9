import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import { TextField, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel } from '@mui/material';
import adminService from 'src/services/admin.services';

export default function EditForm({ open, setOpen, trigger, setTrigger, data }) {
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      role: data?.role || 'user',
      limit: data?.limit || 1,
    },
    validate: (values) => {
      const errors = {};

      if (!values.role) {
        errors.role = 'Role is required';
      }

      if (!values.limit) {
        errors.limit = 'Limit is required';
      }

      return errors;
    },
    onSubmit: (values) => {
      adminService.updateUser(data?.id, values).then((resp) => {
        console.log(resp);
      });
      formik.resetForm();
      setTrigger(!trigger);
      handleClose();
    },
  });

  React.useEffect(() => {
    if (data) {
      let payload = {
        role: data?.role,
        limit: data?.limit,
      };
      formik.resetForm({ values: payload });
    }
  }, [data]);

  const { handleSubmit } = formik;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Edit Record'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <form>
              <FormControl component="fieldset">
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}
                >
                  <FormControlLabel value="admin" control={<Radio color="primary" />} label="Admin" />
                  <FormControlLabel value="user" control={<Radio color="primary" />} label="User" />
                </RadioGroup>
                {formik.errors.role && <div style={{ color: 'red' }}>{formik.errors.role}</div>}
              </FormControl>

              <TextField
                fullWidth
                autoComplete="off"
                type="number"
                label="Limit"
                name="limit"
                value={formik.values.limit}
                onChange={formik.handleChange}
                error={formik.touched.limit && Boolean(formik.errors.limit)}
                helperText={formik.touched.limit && formik.errors.limit}
              />
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
