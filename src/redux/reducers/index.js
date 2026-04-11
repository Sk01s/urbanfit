import authReducer from "./authReducer";
import basketReducer from "./basketReducer";
import checkoutReducer from "./checkoutReducer";
import filterReducer from "./filterReducer";
import miscReducer from "./miscReducer";
import productReducer from "./productReducer";
import ordersReducer from "./ordersReducer";
import profileReducer from "./profileReducer";
import userReducer from "./userReducer";
import wishReducer from "./wishReducer";
import basketV2Reducer from "@/experimental/redux/reducers/basketV2Reducer";
import productV2Reducer from "@/experimental/redux/reducers/productV2Reducer";

const rootReducer = {
  orders: ordersReducer,
  products: productReducer,
  basket: basketReducer,
  wish: wishReducer,
  auth: authReducer,
  profile: profileReducer,
  filter: filterReducer,
  users: userReducer,
  checkout: checkoutReducer,
  app: miscReducer,
  basketV2: basketV2Reducer,
  productsV2: productV2Reducer,
};

export default rootReducer;
