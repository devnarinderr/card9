import axios from 'axios';
import { APIBASEURL } from '../config/settings';

const API_URL = `${APIBASEURL}/api/mail/`;

const sendCard = (emailData) => {
  return axios
    .post(`${API_URL}sendCard`, { emailData })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const supportMail = (emailData) => {
  return axios
    .post(`${API_URL}support`, { emailData })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const feedbackMail = (emailData) => {
  return axios
    .post(`${API_URL}feedback`, { emailData })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const contactLead = (leadData) => {
  return axios
    .post(`${API_URL}contactLead`, leadData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const resetPassword = (email, userId) => {
  return axios
    .post(`${API_URL}resetPassword/${userId}`, { email })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const forgotPassword = (email) => {
  return axios
    .post(`${API_URL}forgotPassword`, { email })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const TextMessage = (phone, shareUrl) => {
  return axios
    .post(`${APIBASEURL}/api/tel/textMessage`, { phone, shareUrl })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const mailService = {
  sendCard,
  supportMail,
  feedbackMail,
  contactLead,
  resetPassword,
  forgotPassword,
  TextMessage,
};

export default mailService;