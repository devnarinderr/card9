import { WEB_APP_THEME } from '../actions/types';

const initialState = { theme: 'light' };

export default function systemProperties(state = initialState, { type, payload } = {}) {
  switch (type) {
    case WEB_APP_THEME:
      return {
        ...state,
        theme: payload,
      };
    default:
      return state;
  }
}
