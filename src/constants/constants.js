export const GET_PRODUCTS = "GET_PRODUCTS";
export const SET_ORDERS = "SET_ORDERS";
export const SEARCH_PRODUCT = "SEARCH_PRODUCT";
export const SEARCH_PRODUCT_SUCCESS = "SEARCH_PRODUCT_SUCCESS";
export const GET_PRODUCTS_SUCCESS = "GET_PRODUCTS_SUCCESS";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const REMOVE_PRODUCT_SUCCESS = "REMOVE_PRODUCT_SUCCESS";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const EDIT_PRODUCT_SUCCESS = "EDIT_PRODUCT_SUCCESS";
export const CANCEL_GET_PRODUCTS = "CANCEL_GET_PRODUCTS";
export const CLEAR_SEARCH_STATE = "CLEAR_SEARCH_STATE";
export const SET_LAST_REF_KEY = "SET_LAST_REF_KEY";

export const SET_BASKET_ITEMS = "SET_BASKET_ITEMS";
export const SET_WISH_ITEMS = "SET_WISH_ITEMS";
export const ADD_TO_BASKET = "ADD_TO_BASKET";
export const ADD_TO_WISH = "ADD_TO_WISH";
export const REMOVE_FROM_BASKET = "REMOVE_FROM_BASKET";
export const REMOVE_FROM_WISH = "REMOVE_FROM_WISH";
export const CLEAR_BASKET = "CLEAR_BASKET";
export const CLEAR_WISH = "CLEAR_WISH";
export const ADD_QTY_ITEM = "ADD_QTY_ITEM";
export const MINUS_QTY_ITEM = "MINUS_QTY_ITEM";

export const SET_CHECKOUT_SHIPPING_DETAILS = "SET_CHECKOUT_SHIPPING_DETAILS";
export const SET_CHECKOUT_PAYMENT_DETAILS = "SET_CHECKOUT_PAYMENT_DETAILS";
export const RESET_CHECKOUT = "RESET_CHECKOUT";

export const SIGNIN = "SIGNIN";
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNUP = "SIGNUP";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNOUT = "SIGNOUT";
export const SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS";
export const SET_AUTH_STATUS = "SET_AUTH_STATUS";
export const SIGNIN_WITH_GOOGLE = "SIGNIN_WITH_GOOGLE";
export const SIGNIN_WITH_FACEBOOK = "SIGNIN_WITH_FACEBOOK";
export const SIGNIN_WITH_GITHUB = "SIGNIN_WITH_GITHUB";
export const ON_AUTHSTATE_CHANGED = "ON_AUTHSTATE_CHANGED";
export const SET_AUTH_PERSISTENCE = "SET_AUTH_PERSISTENCE";
export const ON_AUTHSTATE_SUCCESS = "ON_AUTHSTATE_SUCCESS";
export const ON_AUTHSTATE_FAIL = "ON_AUTHSTATE_FAIL";
export const RESET_PASSWORD = "RESET_PASSWORD";

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const SET_PROFILE = "SET_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const CLEAR_PROFILE = "CLEAR_PROFILE";

export const SET_TEXT_FILTER = "SET_TEXT_FILTER";
export const SET_TYPE_FILTER = "SET_TYPE_FILTER";
export const SET_MIN_PRICE_FILTER = "SET_MIN_PRICE_FILTER";
export const SET_MAX_PRICE_FILTER = "SET_MAX_PRICE_FILTER";
export const RESET_FILTER = "RESET_FILTER";
export const APPLY_FILTER = "APPLY_FILTER";
export const CLEAR_RECENT_SEARCH = "CLEAR_RECENT_SEARCH";
export const REMOVE_SELECTED_RECENT = "REMOVE_SELECTED_RECENT";

export const REGISTER_USER = "REGISTER_USER";
export const GET_USER = "GET_USER";
export const ADD_USER = "ADD_USER";
export const DELETE_USER = "DELETE_USER";
export const EDIT_USER = "EDIT_USER";

export const LOADING = "LOADING";
export const IS_AUTHENTICATING = "IS_AUTHENTICATING";
export const SET_REQUEST_STATUS = "SET_REQUEST_STATUS";
export const categories = [
  { value: "Tops", label: "Tops" },
  { value: "Bottoms", label: "Bottoms" },
  { value: "Active", label: "Active" },
];

export const type = [
  { value: { categories: "Tops", name: "T-shrit" }, label: "T-shrit" },
  {
    value: { categories: "Bottoms", name: "Sweatpants & Pants" },
    label: "Sweatpants & Pants",
  },
  {
    value: { categories: "Bottoms", name: "Leggings" },
    label: "Leggings",
  },
  {
    value: { categories: "Active", name: "Active wear" },
    label: "Active wear",
  },
  { value: { categories: "Tops", name: "Jacket" }, label: "Jacket" },
  {
    value: { categories: "Tops", name: "Hoodies & Sweatshrits" },
    label: "Hoodies & Sweatshrits",
  },
];
export const countries = [
  { label: "Afghanistan", value: "Afghanistan" },
  { label: "Albania", value: "Albania" },
  { label: "Algeria", value: "Algeria" },
  { label: "Andorra", value: "Andorra" },
  { label: "Angola", value: "Angola" },
  { label: "Antigua and Barbuda", value: "Antigua and Barbuda" },
  { label: "Argentina", value: "Argentina" },
  { label: "Armenia", value: "Armenia" },
  { label: "Australia", value: "Australia" },
  { label: "Austria", value: "Austria" },
  { label: "Azerbaijan", value: "Azerbaijan" },
  { label: "Bahamas", value: "Bahamas" },
  { label: "Bahrain", value: "Bahrain" },
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Barbados", value: "Barbados" },
  { label: "Belarus", value: "Belarus" },
  { label: "Belgium", value: "Belgium" },
  { label: "Belize", value: "Belize" },
  { label: "Benin", value: "Benin" },
  { label: "Bhutan", value: "Bhutan" },
  { label: "Bolivia", value: "Bolivia" },
  { label: "Bosnia and Herzegovina", value: "Bosnia and Herzegovina" },
  { label: "Botswana", value: "Botswana" },
  { label: "Brazil", value: "Brazil" },
  { label: "Brunei", value: "Brunei" },
  { label: "Bulgaria", value: "Bulgaria" },
  { label: "Burkina Faso", value: "Burkina Faso" },
  { label: "Burundi", value: "Burundi" },
  { label: "Cabo Verde", value: "Cabo Verde" },
  { label: "Cambodia", value: "Cambodia" },
  { label: "Cameroon", value: "Cameroon" },
  { label: "Canada", value: "Canada" },
  { label: "Central African Republic", value: "Central African Republic" },
  { label: "Chad", value: "Chad" },
  { label: "Chile", value: "Chile" },
  { label: "China", value: "China" },
  { label: "Colombia", value: "Colombia" },
  { label: "Comoros", value: "Comoros" },
  { label: "Congo", value: "Congo" },
  { label: "Costa Rica", value: "Costa Rica" },
  { label: "Croatia", value: "Croatia" },
  { label: "Cuba", value: "Cuba" },
  { label: "Cyprus", value: "Cyprus" },
  { label: "Czechia", value: "Czechia" },
  {
    label: "Democratic Republic of the Congo",
    value: "Democratic Republic of the Congo",
  },
  { label: "Denmark", value: "Denmark" },
  { label: "Djibouti", value: "Djibouti" },
  { label: "Dominica", value: "Dominica" },
  { label: "Dominican Republic", value: "Dominican Republic" },
  { label: "East Timor", value: "East Timor" },
  { label: "Ecuador", value: "Ecuador" },
  { label: "Egypt", value: "Egypt" },
  { label: "El Salvador", value: "El Salvador" },
  { label: "Equatorial Guinea", value: "Equatorial Guinea" },
  { label: "Eritrea", value: "Eritrea" },
  { label: "Estonia", value: "Estonia" },
  { label: "Eswatini", value: "Eswatini" },
  { label: "Ethiopia", value: "Ethiopia" },
  { label: "Fiji", value: "Fiji" },
  { label: "Finland", value: "Finland" },
  { label: "France", value: "France" },
  { label: "Gabon", value: "Gabon" },
  { label: "Gambia", value: "Gambia" },
  { label: "Georgia", value: "Georgia" },
  { label: "Germany", value: "Germany" },
  { label: "Ghana", value: "Ghana" },
  { label: "Greece", value: "Greece" },
  { label: "Grenada", value: "Grenada" },
  { label: "Guatemala", value: "Guatemala" },
  { label: "Guinea", value: "Guinea" },
  { label: "Guinea-Bissau", value: "Guinea-Bissau" },
  { label: "Guyana", value: "Guyana" },
  { label: "Haiti", value: "Haiti" },
  { label: "Honduras", value: "Honduras" },
  { label: "Hungary", value: "Hungary" },
  { label: "Iceland", value: "Iceland" },
  { label: "India", value: "India" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Iran", value: "Iran" },
  { label: "Iraq", value: "Iraq" },
  { label: "Ireland", value: "Ireland" },
  // { label: "Israel", value: "Israel" },
  { label: "Italy", value: "Italy" },
  { label: "Ivory Coast", value: "Ivory Coast" },
  { label: "Jamaica", value: "Jamaica" },
  { label: "Japan", value: "Japan" },
  { label: "Jordan", value: "Jordan" },
  { label: "Kazakhstan", value: "Kazakhstan" },
  { label: "Kenya", value: "Kenya" },
  { label: "Kiribati", value: "Kiribati" },
  { label: "Kosovo", value: "Kosovo" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Kyrgyzstan", value: "Kyrgyzstan" },
  { label: "Laos", value: "Laos" },
  { label: "Latvia", value: "Latvia" },
  { label: "Lebanon", value: "Lebanon" },
  { label: "Lesotho", value: "Lesotho" },
  { label: "Liberia", value: "Liberia" },
  { label: "Libya", value: "Libya" },
  { label: "Liechtenstein", value: "Liechtenstein" },
  { label: "Lithuania", value: "Lithuania" },
  { label: "Luxembourg", value: "Luxembourg" },
  { label: "Madagascar", value: "Madagascar" },
  { label: "Malawi", value: "Malawi" },
  { label: "Malaysia", value: "Malaysia" },
  { label: "Maldives", value: "Maldives" },
  { label: "Mali", value: "Mali" },
  { label: "Malta", value: "Malta" },
  { label: "Marshall Islands", value: "Marshall Islands" },
  { label: "Mauritania", value: "Mauritania" },
  { label: "Mauritius", value: "Mauritius" },
  { label: "Mexico", value: "Mexico" },
  { label: "Micronesia", value: "Micronesia" },
  { label: "Moldova", value: "Moldova" },
  { label: "Monaco", value: "Monaco" },
  { label: "Mongolia", value: "Mongolia" },
  { label: "Montenegro", value: "Montenegro" },
  { label: "Morocco", value: "Morocco" },
  { label: "Mozambique", value: "Mozambique" },
  { label: "Myanmar", value: "Myanmar" },
  { label: "Namibia", value: "Namibia" },
  { label: "Nauru", value: "Nauru" },
  { label: "Nepal", value: "Nepal" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Nicaragua", value: "Nicaragua" },
  { label: "Niger", value: "Niger" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "North Korea", value: "North Korea" },
  { label: "North Macedonia", value: "North Macedonia" },
  { label: "Norway", value: "Norway" },
  { label: "Oman", value: "Oman" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Palau", value: "Palau" },
  { label: "Palestine", value: "Palestine" },
  { label: "Panama", value: "Panama" },
  { label: "Papua New Guinea", value: "Papua New Guinea" },
  { label: "Paraguay", value: "Paraguay" },
  { label: "Peru", value: "Peru" },
  { label: "Philippines", value: "Philippines" },
  { label: "Poland", value: "Poland" },
  { label: "Portugal", value: "Portugal" },
  { label: "Qatar", value: "Qatar" },
  { label: "Romania", value: "Romania" },
  { label: "Russia", value: "Russia" },
  { label: "Rwanda", value: "Rwanda" },
  { label: "Saint Kitts and Nevis", value: "Saint Kitts and Nevis" },
  { label: "Saint Lucia", value: "Saint Lucia" },
  {
    label: "Saint Vincent and the Grenadines",
    value: "Saint Vincent and the Grenadines",
  },
  { label: "Samoa", value: "Samoa" },
  { label: "San Marino", value: "San Marino" },
  { label: "Sao Tome and Principe", value: "Sao Tome and Principe" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Senegal", value: "Senegal" },
  { label: "Serbia", value: "Serbia" },
  { label: "Seychelles", value: "Seychelles" },
  { label: "Sierra Leone", value: "Sierra Leone" },
  { label: "Singapore", value: "Singapore" },
  { label: "Slovakia", value: "Slovakia" },
  { label: "Slovenia", value: "Slovenia" },
  { label: "Solomon Islands", value: "Solomon Islands" },
  { label: "Somalia", value: "Somalia" },
  { label: "South Africa", value: "South Africa" },
  { label: "South Korea", value: "South Korea" },
  { label: "South Sudan", value: "South Sudan" },
  { label: "Spain", value: "Spain" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Sudan", value: "Sudan" },
  { label: "Suriname", value: "Suriname" },
  { label: "Sweden", value: "Sweden" },
  { label: "Switzerland", value: "Switzerland" },
  { label: "Tajikistan", value: "Tajikistan" },
  { label: "Tanzania", value: "Tanzania" },
  { label: "Thailand", value: "Thailand" },
  { label: "Togo", value: "Togo" },
  { label: "Tonga", value: "Tonga" },
  { label: "Trinidad and Tobago", value: "Trinidad and Tobago" },
  { label: "Tunisia", value: "Tunisia" },
  { label: "Turkey", value: "Turkey" },
  { label: "Turkmenistan", value: "Turkmenistan" },
  { label: "Tuvalu", value: "Tuvalu" },
  { label: "Uganda", value: "Uganda" },
  { label: "Ukraine", value: "Ukraine" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States of America", value: "United States of America" },
  { label: "Uruguay", value: "Uruguay" },
  { label: "Uzbekistan", value: "Uzbekistan" },
  { label: "Vanuatu", value: "Vanuatu" },
  { label: "Vatican City", value: "Vatican City" },
  { label: "Venezuela", value: "Venezuela" },
  { label: "Vietnam", value: "Vietnam" },
  { label: "Yemen", value: "Yemen" },
  { label: "Zambia", value: "Zambia" },
  { label: "Zimbabwe", value: "Zimbabwe" },
];
