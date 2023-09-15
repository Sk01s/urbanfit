import { ImageLoader } from "@/components/common";
import { EDIT_PRODUCT } from "@/constants/routes";
import {
  displayActionMessage,
  displayDate,
  displayMoney,
} from "@/helpers/utils";
import PropType from "prop-types";
import React, { useRef } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";

const OrderItem = ({ order, index }) => {
  // console.log(order.items);
  const price = order?.items?.reduce(
    (acc, next) => parseInt(acc) + parseInt(next.price),
    0
  );
  console.log(price);
  const dispatch = useDispatch();
  const history = useHistory();
  const orderRef = useRef(null);

  const onClickEdit = () => {
    history.push(`${EDIT_PRODUCT}/${order.id}`);
  };

  const onDeleteProduct = () => {
    productRef.current.classList.toggle("item-active");
  };

  const onConfirmDelete = () => {
    dispatch(removeProduct(order.id));
    displayActionMessage("Item successfully deleted");
    productRef.current.classList.remove("item-active");
  };

  const onCancelDelete = () => {
    productRef.current.classList.remove("item-active");
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`item item-products ${!index && "item-loading"}`}
        ref={orderRef}
      >
        <div className="grid grid-count-6">
          <div className="grid-col item-img-wrapper"></div>
          <div className="grid-col">
            <span className="text-overflow-ellipsis">
              {order.payment || <Skeleton width={50} />}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {Number.isInteger(price) ? (
                displayMoney(price)
              ) : (
                <Skeleton width={50} />
              )}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {order?.items?.map((item) => (
                <div key={item.name}>{item.name}</div>
              )) || <Skeleton width={30} />}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {order.dateAdded ? (
                displayDate(order.dateAdded)
              ) : (
                <Skeleton width={30} />
              )}
            </span>
          </div>
          <div className="grid-col">
            <span>{order.maxQuantity || <Skeleton width={20} />}</span>
          </div>
        </div>
        {order.id && (
          <div className="item-action">
            <button
              className="button button-border button-small"
              onClick={onClickEdit}
              type="button"
            >
              Edit
            </button>
            &nbsp;
            <button
              className="button button-border button-small button-danger"
              onClick={onDeleteProduct}
              type="button"
            >
              Delete
            </button>
            <div className="item-action-confirm">
              <h5>Are you sure you want to delete this?</h5>
              <button
                className="button button-small button-border"
                onClick={onCancelDelete}
                type="button"
              >
                No
              </button>
              &nbsp;
              <button
                className="button button-small button-danger"
                onClick={onConfirmDelete}
                type="button"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

OrderItem.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    type: PropType.string,
    price: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    sizes: PropType.arrayOf(PropType.string),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    dateAdded: PropType.number,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
};

export default withRouter(OrderItem);
