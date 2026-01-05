import { combineReducers } from 'redux';
import auth from './auth';
import card from './card';
import catalogue from './catalogue';
import systemProperties from './systemProperties';

export default combineReducers({
  auth,
  card,
  catalogue,
  systemProperties,
});
