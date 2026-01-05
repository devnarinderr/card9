import axios from 'axios';
import { APIBASEURL } from '../config/settings';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const API_URL = `${APIBASEURL}/api/auth/`;

const register = (firstName, lastName, email, password) => {
  return axios
    .post(`${API_URL}register`, {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response;
    });
};

const googleLogin = () => {
  return axios
    .get(`${APIBASEURL}/api/oAuth/user`, { withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const emailVerify = (id) => {
  return axios
    .patch(`${API_URL}emailVerification/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const login = (email, password) => {
  return axios
    .post(`${API_URL}login`, {
      email: email.toLowerCase(),
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const resetPassword = (data, token) => {
  return axios
    .patch(`${API_URL}resetPassword/${token}`, { data })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('card');
  cookies.remove('token');
};

const updateProfile = (data, id) => {
  return axios
    .post(`${API_URL}update-profil/${id}`, {
      data,
    })
    .then((response) => {
      return response;
    });
};

const updateEmail = (id, email) => {
  return axios
    .post(`${API_URL}update-email/${id}`, {
      id,
      email,
    })
    .then((response) => {
      return response.data;
    });
};

const deleteUser = (id) => {
  return axios
    .delete(`${API_URL}delete-user/${id}`, {
      id,
    })
    .then((response) => {
      return response;
    });
};

const authService = {
  register,
  googleLogin,
  emailVerify,
  login,
  resetPassword,
  logout,
  updateProfile,
  updateEmail,
  deleteUser,
};

export default authService;
