import { GET_CATALOGUE_SUCCESS, GET_CATALOGUE_FAIL } from './types';
import catalogueService from '../services/catalogue.services';
import { setCatalogue } from '../common/utilities';

export const getCatalogue = (id) => (dispatch) =>
  catalogueService.getOneCatalogue(id).then(
    (response) => {
      dispatch({
        type: GET_CATALOGUE_SUCCESS,
        payload: { catalogue: response.data },
      });

      setCatalogue(response.data);
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: GET_CATALOGUE_FAIL,
      });
      return Promise.reject();
    }
  );
