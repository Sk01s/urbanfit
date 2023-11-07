import { useWish } from "@/hooks";
import React from "react";
import { ProductGrid } from "@/components/product";
import { useScrollTop } from "@/hooks";
// Just add this feature if you want :P

const UserWishList = () => {
  useScrollTop();
  const { wish, addToWish, isItemOnWish } = useWish();
  return (
    <div
      style={{ minHeight: "80dvh", marginTop: "10rem", textAlign: "center" }}
    >
      <h3>My Wish List</h3>
      <section className="product-list-wrapper" style={{ width: "100%" }}>
        <ProductGrid products={wish} />
      </section>
    </div>
  );
};

export default UserWishList;
