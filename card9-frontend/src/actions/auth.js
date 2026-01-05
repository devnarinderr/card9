import Cookies from 'universal-cookie';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  EMAIL_UPDATED,
  EMAIL_UPDATE_FAIL,
  DELETE_USER,
  DELETE_USER_FAIL,
  PROFILE_UPDATED,
  PROFILE_UPDATED_FAIL,
  GOOGLE_LOGIN,
  GOOGLE_LOGIN_FAIL,
} from './types';
import authService from '../services/auth.services';
import { getUser, setUser } from '../common/utilities';

export const register = (firstName, lastName, email, password) => (dispatch) =>
  authService.register(firstName, lastName, email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      return Promise.resolve(response);
    },
    (error) => {
      dispatch({
        type: REGISTER_FAIL,
      });

      return Promise.reject(error);
    }
  );

export const googleLogin = () => (dispatch) =>
  authService.googleLogin().then(
    (response) => {
      dispatch({
        type: GOOGLE_LOGIN,
        payload: response,
      });

      console.log(response);

      const cookies = new Cookies();
      cookies.set('token', response.token, { path: '/', maxAge: 43200, sameSite: 'lax' });

      setUser(response.user);

      return Promise.resolve(response);
    },
    (error) => {
      dispatch({
        type: GOOGLE_LOGIN_FAIL,
      });

      return Promise.reject();
    }
  );

export const login = (email, password) => (dispatch) =>
  authService.login(email, password).then(
    (response) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response },
      });

      const cookies = new Cookies();
      cookies.set('token', response.token, { path: '/', maxAge: 43200, sameSite: 'lax' });

      setUser(response.data);

      return Promise.resolve(response.data);
    },
    (error) => {
      dispatch({
        type: LOGIN_FAIL,
      });

      return Promise.reject(error);
    }
  );

export const logout = () => (dispatch) => {
  authService.logout();
  dispatch({
    type: LOGOUT,
  });
};

export const updateProfile = (data, id) => (dispatch) => {
  authService.updateProfile(data, id).then(
    (response) => {
      dispatch({
        type: PROFILE_UPDATED,
        payload: { user: response.data },
      });

      setUser(response.data);

      return Promise.resolve(response);
    },
    (error) => {
      dispatch({
        type: PROFILE_UPDATED_FAIL,
      });

      return Promise.reject(error);
    }
  );
};

export const updateEmail = (id, email) => (dispatch) => {
  authService.updateEmail(id, email).then(
    (response) => {
      dispatch({
        type: EMAIL_UPDATED,
        payload: { user: response.data },
      });

      setUser(response.data);

      return Promise.resolve();
    },
    (error) => {
      dispatch({
        type: EMAIL_UPDATE_FAIL,
      });

      return Promise.reject();
    }
  );
};

export const deleteUser = (id) => (dispatch) => {
  authService.deleteUser(id).then(
    (response) => {
      dispatch({
        type: DELETE_USER,
      });

      return Promise.resolve(response);
    },
    (error) => {
      dispatch({
        type: DELETE_USER_FAIL,
      });

      return Promise.reject(error);
    }
  );
};
