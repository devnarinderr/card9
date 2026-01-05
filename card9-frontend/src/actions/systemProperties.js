import { WEB_APP_THEME } from './types';

export const changeTheme = (theme) => (dispatch) =>
  dispatch({
    type: WEB_APP_THEME,
    payload: theme,
  });
