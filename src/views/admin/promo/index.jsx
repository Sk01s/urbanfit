/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from "@/components/common";
import { AppliedFilters, ProductList } from "@/components/product";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectFilter } from "@/selectors/selector";
import { ProductsNavbar } from "../components";
import ProductsTable from "../components/ProductsTable";
import { ADD_PROMO } from "@/constants/routes";
import firebaseInstance from "@/services/firebase";
import PromotItem from "../components/PromoItem";

const Products = () => {
  useDocumentTitle("Product List | Urbanfit Admin");
  useScrollTop();
  const [promos, setPromos] = useState([]);
  useEffect(() => {
    const getPromo = async () => {
      const data = await firebaseInstance.getPromos();
      const promos = data.docs.map((promo) => promo.data());
      setPromos(promos);
    };
  }, []);
  
  return (
    <Boundary>
      <ProductsNavbar
        name={"Promo"}
        to={ADD_PROMO}
        // productsCount={store.products.items.length}
        // totalProductsCount={store.products.total}
      />
      <div className="product-admin-items">
        {/* <ProductList {...store}> */}
        {/* <AppliedFilters filter={store.filter} /> */}
        <div>
          {promos.length > 0 && (
            <div className="grid grid-product grid-count-6">
              <div className="grid-col" />
              <div className="grid-col">
                <h5>Name</h5>
              </div>
              <div className="grid-col">
                <h5>Type</h5>
              </div>
              <div className="grid-col">
                <h5>Price</h5>
              </div>
              <div className="grid-col">
                <h5>Date Added</h5>
              </div>
              <div className="grid-col">
                <h5>Qty</h5>
              </div>
            </div>
          )}
          {promos.length === 0
            ? new Array(10).fill({}).map((product, index) => (
                <PromotItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={`product-skeleton ${index}`}
                  product={product}
                />
              ))
            : promos.map((product) => (
                <PromoItem key={product.id} product={product} />
              ))}
        </div>
        {/* </ProductList> */}
      </div>
    </Boundary>
  );
};

export default withRouter(Products);
