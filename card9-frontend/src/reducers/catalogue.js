import {
  CREATE_CATALOGUE_SUCCESS,
  CREATE_CATALOGUE_FAIL,
  GET_CATALOGUE_SUCCESS,
  GET_CATALOGUE_FAIL,
  EDIT_CATALOGUE_SUCCESS,
  EDIT_CATALOGUE_FAIL,
} from '../actions/types';
import { getCatalogue } from '../common/utilities';

const isCatalogue = getCatalogue();

const initialState = catalogue
  ? { isCatalogueEditable: true, catalogueData: isCatalogue }
  : { isCatalogueEditable: false, catalogueData: null };

export default function catalogue(state = initialState, { type, payload } = {}) {
  switch (type) {
    case CREATE_CATALOGUE_SUCCESS:
      return {
        ...state,
        isCatalogueEditable: true,
        catalogueData: payload.catalogue,
      };

    case CREATE_CATALOGUE_FAIL:
      return {
        ...state,
        isCatalogueEditable: false,
        catalogueData: null,
      };

    case GET_CATALOGUE_SUCCESS:
      return {
        ...state,
        isCatalogueEditable: true,
        catalogueData: payload.catalogue,
      };

    case GET_CATALOGUE_FAIL:
      return {
        ...state,
        isCatalogueEditable: false,
        catalogueData: null,
      };

    case EDIT_CATALOGUE_SUCCESS:
      return {
        ...state,
        isCatalogueEditable: true,
        catalogueData: payload.catalogue,
      };

    case EDIT_CATALOGUE_FAIL:
      return {
        ...state,
        isCatalogueEditable: false,
        catalogueData: null,
      };

    default:
      return state;
  }
}
