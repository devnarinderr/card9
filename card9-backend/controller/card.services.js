import axios from 'axios';
import { APIBASEURL } from '../config/settings';

const API_URL = `${APIBASEURL}/api/card/`;

const getOneCard = (name) => {
  return axios
    .get(`${API_URL}${name}`, {
      name,
    })
    .then((response) => {
      console.log(response.data.card, "chekc rpsonse of one cartd")

      console.log(response.data.images, "chekc rpsonse of one cartd")

      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getAllCards = (userId) => {
  console.log(userId, "check user id ")
  return axios
    .get(`${API_URL}all-cards/${userId}`, {
      userId,
    })
    .then((response) => {
      console.log(response, "check all cards")
      
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const newCard = (cardData, userId) => {
  return axios
    .post(`${API_URL}new-card/${userId}`, {
      cardData,
      userId,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const editCard = (cardData, cardId) => {
  return axios
    .patch(`${API_URL}edit/${cardId}`, { cardData })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const downloadVcf = (name) => { 
  return axios
    .get(`${API_URL}add-contact/${name}`)
    .then((response) => {
      console.log('--=-=', response);
      return response;
    })
    .catch((error) => {
      console.log(error, "check error in conatct ")
      return error.response;
    });
};

const deleteCard = (id) => {
  axios
    .delete(`${API_URL}delete/${id}`, {
      id,
    })
    .then((response) => {})
    .catch((error) => {
      console.error(error);
    });
};

const cardService = {
  getOneCard,
  getAllCards,
  newCard,
  editCard,
  downloadVcf,
  deleteCard,
};

export default cardService;
