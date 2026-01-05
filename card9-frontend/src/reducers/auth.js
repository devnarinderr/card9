import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  EMAIL_UPDATED,
  EMAIL_UPDATE_FAIL,
  PROFILE_UPDATED,
  PROFILE_UPDATED_FAIL,
  DELETE_USER,
  DELETE_USER_FAIL,
  GOOGLE_LOGIN,
  GOOGLE_LOGIN_FAIL,
} from '../actions/types';
import { getUser } from '../common/utilities';

const user = getUser();

const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

export default function auth(state = initialState, { type, payload } = {}) {
  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };

    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    case GOOGLE_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case GOOGLE_LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    case PROFILE_UPDATED:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case PROFILE_UPDATED_FAIL:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case EMAIL_UPDATED:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case EMAIL_UPDATE_FAIL:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    case DELETE_USER:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    case DELETE_USER_FAIL:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };

    default:
      return state;
  }
}
