import CryptoJS from 'crypto-js';
import { SECRET } from '../../config/settings';

export function getUser() {
  try {
    const user = localStorage.getItem('user')
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('user'), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return user;
  } catch (e) {
    console.error('loading user error');
    return null;
  }
}

export function setUser(user) {
  try {
    localStorage.setItem('user', CryptoJS.AES.encrypt(JSON.stringify(user), SECRET).toString());
  } catch (e) {
    console.error('saving user error');
  }
}

export function getCard() {
  try {
    const card = localStorage.getItem('card')
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('card'), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return card;
  } catch (e) {
    console.error('loading card error');
    return null;
  }
}

export function setCard(card) {
  try {
    localStorage.setItem('card', CryptoJS.AES.encrypt(JSON.stringify(card), SECRET).toString());
  } catch (e) {
    console.error('saving card error');
  }
}

export function getCatalogue() {
  try {
    const catalogue = localStorage.getItem('catalogue')
      ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('catalogue'), SECRET).toString(CryptoJS.enc.Utf8))
      : null;
    return catalogue;
  } catch (e) {
    console.error('loading catalogue error');
    return null;
  }
}

export function setCatalogue(catalogue) {
  try {
    localStorage.setItem('catalogue', CryptoJS.AES.encrypt(JSON.stringify(catalogue), SECRET).toString());
  } catch (e) {
    console.error('saving catalogue error');
  }
}

export function extractExtensionFromBase64(dataURI) {
  const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9]+);base64,/;
  const match = dataURI.match(regex);

  if (match && match.length > 1) {
    const mimeType = match[1];
    const parts = mimeType.split('/');
    if (parts.length === 2) {
      return parts[1];
    }
  }

  return null;
}
