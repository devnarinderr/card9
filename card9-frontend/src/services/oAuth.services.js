import axios from 'axios';
import { APIBASEURL } from '../config/settings';

const API_URL = `${APIBASEURL}/api/oAuth/`;

const GoogleLogin = () => {
  axios
    .get(`${API_URL}google`)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

const FacebookLogin = () => {
  axios
    .get(`${API_URL}facebook`)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

const oAuthService = {
  GoogleLogin,
  FacebookLogin,
};

export default oAuthService;
