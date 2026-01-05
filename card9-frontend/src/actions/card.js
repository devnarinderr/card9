import {
  GET_CARD_SUCCESS,
  GET_CARD_FAIL,
  EDIT_CARD_SUCCESS,
  EDIT_CARD_FAIL,
  CREATE_CARD_SUCCESS,
  CREATE_CARD_FAIL,
} from './types';
import cardService from '../services/card.services';
import { setCard } from '../common/utilities';

export const createCard = (cardData, userId) => (dispatch) =>
  cardService.newCard(cardData, userId).then(
    (response) => {
      dispatch({
        type: CREATE_CARD_SUCCESS,
        payload: { card: response.data },
      });

      setCard(response.data);
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: CREATE_CARD_FAIL,
      });
      return Promise.reject();
    }
  );

export const getCard = (id) => (dispatch) =>
  cardService.getOneCard(id).then(
    (response) => {
      dispatch({
        type: GET_CARD_SUCCESS,
        payload: { card: response.data },
      });

      setCard(response.data);
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: GET_CARD_FAIL,
      });
      return Promise.reject();
    }
  );

export const editCard = (id) => (dispatch) =>
  cardService.editCard(id).then(
    (response) => {
      dispatch({
        type: EDIT_CARD_SUCCESS,
        payload: { card: response.data },
      });

      setCard(response.data);
      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: EDIT_CARD_FAIL,
      });
      return Promise.reject();
    }
  );
