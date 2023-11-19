import InfoBox from "@/components/product/InfoBox";
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import firebaseInstance from "@/services/firebase";
import { displayActionMessage } from "@/helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPromo } from "@/redux/actions/checkoutActions";

const PromoBox = () => {
  const dispatch = useDispatch();
  const used = useSelector((store) => store.checkout.promo);
  const [code, setCode] = useState("");
  // dispatch(setPromo({ percentage: 0 }));
  const applyPromoCode = async () => {
    try {
      const promo = await firebaseInstance.usePromoCode(code);
      dispatch(setPromo(promo));
      displayActionMessage("Promo code is set Sucssesfully", "success");
    } catch (error) {
      displayActionMessage(error, "error");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "5rem",
        paddingInline: "3rem",
        // alignItems: "center",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Discout code"
        disabled={used.percentage}
        type="text"
        value={used.percentage ? used.code : code}
        fullWidth
        onChange={(e) => setCode(e.currentTarget.value)}
      />
      <button
        onClick={applyPromoCode}
        disabled={used.percentage}
        className="button"
        style={{
          fontSize: "1.3rem",
          textTransform: "capitalize",
          borderRadius: "0.5rem",
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default PromoBox;
