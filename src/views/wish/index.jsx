import { useWish } from "@/hooks";
import { useProductsV2 } from "@/experimental/hooks";
import { expandProductForDisplay } from "@/experimental/helpers/getProductVariant";
import React, { useMemo } from "react";
import { ProductGrid } from "@/components/product";
import { useScrollTop } from "@/hooks";
import { MessageDisplay } from "@/components/common";

const UserWishList = () => {
  useScrollTop();
  const { wish, addToWish, isItemOnWish } = useWish();
  const { products } = useProductsV2();

  const expandedWish = useMemo(() => {
    const wishProductIds = new Set(wish.map((item) => item.id));
    return products
      .filter((p) => wishProductIds.has(p.id))
      .flatMap((p) => expandProductForDisplay(p));
  }, [wish, products]);

  return (
    <div
      style={{ minHeight: "80dvh", marginTop: "12rem", textAlign: "center" }}
    >
      <h3>My Wish List</h3>
      {expandedWish.length === 0 ? (
        <MessageDisplay message={"Wish list is empty"} />
      ) : (
        <section className="product-list-wrapper" style={{ width: "100%" }}>
          <ProductGrid products={expandedWish} />
        </section>
      )}
    </div>
  );
};

export default UserWishList;