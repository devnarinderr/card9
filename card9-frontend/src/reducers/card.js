import {
  GET_CARD_SUCCESS,
  GET_CARD_FAIL,
  EDIT_CARD_SUCCESS,
  EDIT_CARD_FAIL,
  CREATE_CARD_SUCCESS,
  CREATE_CARD_FAIL,
} from '../actions/types';
import { getCard } from '../common/utilities';

const isCard = getCard();

const initialState = card ? { isCardEditable: true, cardData: isCard } : { isCardEditable: false, cardData: null };

export default function card(state = initialState, { type, payload } = {}) {
  switch (type) {
    case CREATE_CARD_SUCCESS:
      return {
        ...state,
        isCardEditable: true,
        cardData: payload.card,
      };

    case CREATE_CARD_FAIL:
      return {
        ...state,
        isCardEditable: false,
        cardData: null,
      };
      
    case GET_CARD_SUCCESS:
      return {
        ...state,
        isCardEditable: true,
        cardData: payload.card,
      };

    case GET_CARD_FAIL:
      return {
        ...state,
        isCardEditable: false,
        cardData: null,
      };

    case EDIT_CARD_SUCCESS:
      return {
        ...state,
        isCardEditable: true,
        cardData: payload.card,
      };

    case EDIT_CARD_FAIL:
      return {
        ...state,
        isCardEditable: false,
        cardData: null,
      };

    default:
      return state;
  }
}
