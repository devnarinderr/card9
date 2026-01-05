import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import copyImage from '../../../assets/images/copy.svg';
import './buttonStyle.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { DialogActions, Button, Typography } from '@mui/material';
import Slide from '@mui/material/Slide';
import copy from 'copy-to-clipboard';
import Iconify from '../../../components/Iconify';
import Logo from '../../../assets/images/Logo-33x33.png';
import IconSnackbar from '../../../components/IconSnackbar';
import { QRCodeTab, QRLink } from './SingleCardStyles';
import mailService from '../../../services/mail.services';
import cardService from '../../../services/card.services';
import { saveAs } from 'file-saver';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" timeout={5000} ref={ref} {...props} />;
});

const SaveCard = ({ open, handleClose, color, cardName, cardAsImage, setSuccess }) => {
  const [value, setValue] = useState('1');
  const [linkCopied, setLinkCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  const PhoneRegex = /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const shareUrl = `${window.location.origin}/${cardName}`;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getIcon = (icon, width = 24, height = 26) => <Iconify icon={icon} width={width} height={height} />;

  const handleEmailSend = async () => {
    if (regex.test(email)) {
      const tempObj = {};
      const cardImage = await cardAsImage();
      const newValues = Object.assign(tempObj, {
        email,
        cardImage,
        cardName,
      });
      mailService.sendCard(newValues);
      setSuccess(true);
      handleClose();
      setEmail(null);
    } else {
      setErrorMsg('Email is not valid');
      setError(true);
    }
  };

  const handleVcfDownload = () => {
    cardService.downloadVcf(cardName).then((resp) => {
      const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'text/vcard' }));
      saveAs(url);
    });
  };

  const handleTextSend = () => {
    if (PhoneRegex.test(phone)) {
      mailService.TextMessage(phone, shareUrl);
      setSuccess(true);
      setPhone(null);
      handleClose();
    } else {
      setErrorMsg('Phone is not valid');
      setError(true);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          width: 75,
          height: 75,
          background: color,
          borderRadius: 50,
          position: 'absolute',
          marginLeft: '38%',
          top: '-2rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      ></Box>
      <Button onClick={handleClose} sx={{ width: 24, height: 30, marginLeft: '80%', color }}>
        {getIcon('mdi:close')}
      </Button>
      <DialogTitle id="alert-dialog-title">{'Save Card'}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', marginBottom: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: `${color} !important` },
              '& .Mui-selected': { color: `${color} !important` },
            }}
          >
            <Tab value="1" label="Email" />
            <Tab value="2" label="Text" />
            <Tab value="3" label="Code" />
          </Tabs>
        </Box>
        {value === '1' && (
          <>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="text"
                className="input"
                placeholder="Email"
                required
              />
            </FormControl>
            <DialogActions>
              <button className="buttonAnimation" onClick={() => handleEmailSend()} style={{ background: color }}>
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Send</span>
              </button>
            </DialogActions>
            <IconSnackbar open={error} setOpen={setError} title="Error" type="error" msg={errorMsg} />
          </>
        )}

        {value === '2' && (
          <>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <input
                onChange={(e) => setPhone(e.target.value)}
                type="phone"
                name="text"
                className="input"
                placeholder="Phone Number"
                required
              />
            </FormControl>
            <DialogActions>
              <a
                className="buttonAnimation"
                style={{ background: color }}
                href={`sms:${phone}?&body=${cardName} Bussiness card ${shareUrl}`}
              >
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Send</span>
              </a>
            </DialogActions>
          </>
        )}
        {value === '3' && (
          <>
            <QRCodeTab>
              <QRLink href="#" sx={{ py: 2, pointerEvents: 'none' }}>
                <QRCode value={shareUrl} logoImage={Logo} logoWidth="32" logoHeight="32" />
              </QRLink>
              <button
                onClick={() => {
                  copy(shareUrl);
                  setLinkCopied(true);
                }}
                className="copyButton"
                style={{ background: color }}
              >
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <img src={copyImage} alt="copy" />
                  </div>
                </div>
                <span>Copy Link</span>
              </button>
              <IconSnackbar
                open={linkCopied}
                setOpen={setLinkCopied}
                title="Success"
                msg="The link to your card has been copied to the clipboard."
              />
            </QRCodeTab>
          </>
        )}
      </DialogContent>
      <Box sx={{ height: 20 }}></Box>
      <hr />
      <Box sx={{ height: 150, padding: 2, textAlign: 'center' }}>
        <button onClick={() => handleVcfDownload()} className="download-button">
          <div className="docs">
            <svg
              className="css-i6dzq1"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              height="20"
              width="20"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line y2="13" x2="8" y1="13" x1="16"></line>
              <line y2="17" x2="8" y1="17" x1="16"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>{' '}
            Add To Contact
          </div>
          <div className="download" style={{ background: color }}>
            <svg
              className="css-i6dzq1"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line y2="3" x2="12" y1="15" x1="12"></line>
            </svg>
          </div>
        </button>
      </Box>
    </Dialog>
  );
};

export default SaveCard;
