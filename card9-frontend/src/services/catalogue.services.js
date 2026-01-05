import axios from 'axios';
import { APIBASEURL } from '../config/settings';

const API_URL = `${APIBASEURL}/api/Catalogue/`;

const newCatalogue = (catalogData, userId) => {
  return axios
    .post(`${API_URL}new-catalogue/${userId}`, {
      catalogData,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const getOneCatalogue = (catalogueId) => {
  return axios
    .get(`${API_URL}${catalogueId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const getOneCatalogueWithName = (catalogueName) => {
  return axios
    .get(`${API_URL}name/${catalogueName}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const getAllCataloguesByCardId = (cardId) => {
  return axios
    .get(`${API_URL}all-catalogue/${cardId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const getAllCataloguesByUserId = (userId) => {
  return axios
    .get(`${API_URL}all-catalogue-by-user/${userId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const deleteCatalogue = (catalogueId) => {
  return axios
    .delete(`${API_URL}delete/${catalogueId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const editCatalogue = (catalogueData, catalogueId) => {
  return axios
    .patch(`${API_URL}edit/${catalogueId}`, {
      catalogueData,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

const catalogueService = {
  newCatalogue,
  getOneCatalogue,
  getOneCatalogueWithName,
  getAllCataloguesByCardId,
  getAllCataloguesByUserId,
  deleteCatalogue,
  editCatalogue,
};

export default catalogueService;
