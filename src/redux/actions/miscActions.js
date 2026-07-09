import {
  HIDE_PROMO_POPUP, IS_AUTHENTICATING, LOADING, SET_AUTH_STATUS, SET_REQUEST_STATUS, SHOW_PROMO_POPUP
} from '@/constants/constants';

export const setLoading = (bool = true) => ({
  type: LOADING,
  payload: bool
});

export const setAuthenticating = (bool = true) => ({
  type: IS_AUTHENTICATING,
  payload: bool
});

export const setRequestStatus = (status) => ({
  type: SET_REQUEST_STATUS,
  payload: status
});


export const setAuthStatus = (status = null) => ({
  type: SET_AUTH_STATUS,
  payload: status
});

export const showPromoPopup = () => ({
  type: SHOW_PROMO_POPUP,
});

export const hidePromoPopup = () => ({
  type: HIDE_PROMO_POPUP,
});
