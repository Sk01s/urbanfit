import { useDocumentTitle } from "@/hooks";
import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "@/redux/actions/ordersActions";
import { Boundary } from "@/components/common";
import { AppliedFilters, ProductList } from "@/components/product";
import { withRouter } from "react-router-dom";
import { selectFilter } from "@/selectors/selector";
import { ProductsNavbar } from "../components";
import ProductsTable from "../components/ProductsTable";
import { OrderItem } from "@/views/admin/components";
import { FiltersToggle, SearchBar } from "@/components/common";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const getOrders = async () => {
      const res = await firebase.getOrders();
      const orders = await res.docs.map((res) => res.data());
      setOrders(orders);
    };
    getOrders();
  }, []);
  useDocumentTitle(" Orders | urbanfit");
  return (
    <Boundary>
      <div className="product-admin-header">
        <h3 className="product-admin-header-title">
          Orders &nbsp; ({`${orders.length} / ${0}`})
        </h3>
        &nbsp;
      </div>
      <div className="product-admin-items">
        <Boundary>
          <div>
            {orders.length > 0 && (
              <div className="grid grid-product grid-count-6">
                <div className="grid-col">
                  <h5>Payment</h5>
                </div>
                <div className="grid-col">
                  <h5>Price</h5>
                </div>
                <div className="grid-col">
                  <h5>items</h5>
                </div>
                <div className="grid-col">
                  <h5>Orders date </h5>
                </div>
                <div className="grid-col">
                  <h5>address</h5>
                </div>
              </div>
            )}
            {orders.length === 0
              ? new Array(15).fill({}).map((order, index) => (
                  <OrderItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={`product-skeleton ${index}`}
                    order={order}
                    index={index}
                  />
                ))
              : orders.map((order, index) => {
                  console.log(order);
                  return <OrderItem key={index} order={order} index={index} />;
                })}
          </div>
          {/* Show 'Show More' button if products length is less than total products */}
          {orders.length < orders.total && (
            <div className="d-flex-center padding-l">
              <button
                className="button button-small"
                disabled={isFetching}
                onClick={fetchProducts}
                type="button"
              >
                {isFetching ? "Fetching Items..." : "Show More Items"}
              </button>
            </div>
          )}
        </Boundary>
      </div>
    </Boundary>
  );
};

export default Orders;
