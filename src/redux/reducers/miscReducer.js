import {
  HIDE_PROMO_POPUP, IS_AUTHENTICATING, LOADING, SET_AUTH_STATUS, SET_REQUEST_STATUS, SHOW_PROMO_POPUP
} from '@/constants/constants';

const initState = {
  loading: false,
  isAuthenticating: false,
  authStatus: null,
  requestStatus: null,
  theme: 'light',
  promoPopupVisible: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case IS_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: action.payload
      };
    case SET_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: action.payload
      };
    case SET_AUTH_STATUS:
      return {
        ...state,
        authStatus: action.payload
      };
    case SHOW_PROMO_POPUP:
      return {
        ...state,
        promoPopupVisible: true,
      };
    case HIDE_PROMO_POPUP:
      return {
        ...state,
        promoPopupVisible: false,
      };
    default:
      return state;
  }
};
