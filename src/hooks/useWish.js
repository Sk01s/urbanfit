import { displayActionMessage } from "@/helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWish as dispatchAddToWish,
  removeFromWish as dispatchRemoveFromWish,
} from "@/redux/actions/wishActions";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

const useWish = () => {
  const { wish } = useSelector((state) => ({ wish: state.wish }));
  const { profile } = useSelector((state) => ({ profile: state.profile }));
  const { auth } = useSelector((state) => ({ auth: state.auth }));
  const dispatch = useDispatch();

  const isItemOnWish = (id) => !!wish.find((item) => item.id === id);

  const removeFromWish = (product) => {
    dispatch(dispatchRemoveFromWish(product.id));
    displayActionMessage("Item removed from wish list", "info");
    
    // Cancel scheduled reminder email
    if (auth?.id) {
      fetch(`${BACKEND_API_URL}/api/wishlist/cancel-reminder/${auth.id}/${product.id}`, {
        method: "DELETE",
      }).catch((err) => console.error("Failed to cancel wishlist reminder:", err));
    }
  };

  const addToWish = (product) => {
    if (isItemOnWish(product.id)) return removeFromWish(product);
    
    // Add timestamp when adding to wishlist
    const productWithTimestamp = {
      ...product,
      addedToWishlistAt: Date.now(),
    };
    
    dispatch(dispatchAddToWish(productWithTimestamp));
    displayActionMessage("Item added to wish list", "success");
    
    // Schedule reminder email if user is logged in
    if (auth?.id && profile?.email) {
      fetch(`${BACKEND_API_URL}/api/wishlist/schedule-reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.id,
          userEmail: profile.email,
          userName: profile.fullname,
          product: productWithTimestamp,
          addedAt: Date.now(),
        }),
      }).catch((err) => console.error("Failed to schedule wishlist reminder:", err));
    }
  };

  return { wish, removeFromWish, addToWish, isItemOnWish };
};

export default useWish;
