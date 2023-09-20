import { ImageLoader } from "@/components/common";
import { ORDER_DETAILS } from "@/constants/routes";
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
import { Link } from "react-router-dom";

const OrderItem = ({ order, index }) => {
  const price = order?.items?.reduce(
    (acc, next) => parseInt(acc) + parseInt(next.price),
    0
  );
  const totalPrice = order?.address?.isInternational ? price + 50 : price + 5;
  const dispatch = useDispatch();
  const history = useHistory();
  const orderRef = useRef(null);

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div className={`item item-products `} ref={orderRef}>
        <div className="grid grid-count-6">
          <div className="grid-col">
            <span className="text-overflow-ellipsis">
              {order.payment || <Skeleton width={50} />}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {Number.isInteger(price) ? (
                displayMoney(totalPrice)
              ) : (
                <Skeleton width={50} />
              )}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {order?.items ? (
                order?.fulfillment ? (
                  "Yes"
                ) : (
                  "No"
                )
              ) : (
                <Skeleton width={50} />
              )}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {order.date ? (
                displayDate(order.date.toDate())
              ) : (
                <Skeleton width={30} />
              )}
            </span>
          </div>
          <div className="grid-col">
            {order.items && (
              <Link to={`/admin/orders/${order.id}`}>View details</Link>
            )}
          </div>
        </div>
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
