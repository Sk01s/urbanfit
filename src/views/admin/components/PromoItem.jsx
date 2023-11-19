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
import { removeProduct } from "@/redux/actions/productActions";
import firebaseInstance from "@/services/firebase";
import { useState } from "react";

const PromoItem = ({ promo }) => {
  const dispatch = useDispatch();
  const [deleted, setDeleted] = useState(false);
  const history = useHistory();
  const promoRef = useRef(null);

  const onClickEdit = () => {
    history.push(`${EDIT_PRODUCT}/${promo.code}`);
  };

  const onDeleteProduct = () => {
    promoRef.current.classList.toggle("item-active");
  };

  const onConfirmDelete = async () => {
    try {
      await firebaseInstance.removePromo(promo.code);
      displayActionMessage("promo successfully deleted", "success");
      setDeleted(true);
    } catch (error) {
      displayActionMessage("promo has not been deleted", "error");
    }
    promoRef.current.classList.remove("item-active");
  };

  const onCancelDelete = () => {
    promoRef.current.classList.remove("item-active");
  };

  return (
    deleted || (
      <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
        <div
          className={`item item-products ${!promo.code && "item-loading"}`}
          ref={promoRef}
        >
          <div className="grid grid-count-6">
            <div className="grid-col">
              <span className="text-overflow-ellipsis">
                {promo.code || <Skeleton width={50} />}
              </span>
            </div>
            <div className="grid-col">
              <span>{promo.percentage ?? <Skeleton width={50} />}</span>
            </div>
            <div className="grid-col">
              <span className="text-overflow-ellipsis">
                {promo.uses ?? <Skeleton width={50} />}
              </span>
            </div>
            <div className="grid-col">
              <span>{promo.max || <Skeleton width={30} />}</span>
            </div>
            <div className="grid-col">
              <span>
                {promo.startDate ? (
                  displayDate(promo.startDate)
                ) : (
                  <Skeleton width={30} />
                )}
              </span>
            </div>
            <div className="grid-col">
              <span>
                {promo.endDate ? (
                  displayDate(promo.endDate)
                ) : (
                  <Skeleton width={30} />
                )}
              </span>
            </div>
          </div>
          {promo.code && (
            <div className="item-action">
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
    )
  );
};

PromoItem.propTypes = {
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

export default withRouter(PromoItem);
