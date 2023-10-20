import { useWish } from "@/hooks";
import React from "react";
import { ProductGrid } from "@/components/product";
// Just add this feature if you want :P

const UserWishListTab = () => {
  const { wish, addToWish, isItemOnWish } = useWish();
  return (
    <div className="loader" style={{ minHeight: "80dvh" }}>
      <h3>My Wish List</h3>
      <section className="product-list-wrapper" style={{ width: "100%" }}>
        <ProductGrid products={wish} />
      </section>
    </div>
  );
};

export default UserWishListTab;
