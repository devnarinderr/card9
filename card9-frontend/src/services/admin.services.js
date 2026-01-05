import axios from 'axios';
import { APIBASEURL } from '../config/settings';

const API_URL = `${APIBASEURL}/api/admin/`;

const getAllUsers = () => {
  return axios
    .get(`${API_URL}all-users`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const updateUser = (id, values) => {
  return axios
    .patch(`${API_URL}updateUser/${id}`, { values })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const renewCard = (id) => {
  return axios
    .patch(`${API_URL}renew-card/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getCardByUserId = (id) => {
  return axios
    .get(`${API_URL}card-by-userId/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};

const adminService = {
  getAllUsers,
  updateUser,
  renewCard,
  getCardByUserId,
};

export default adminService;
