/* eslint-disable react/forbid-prop-types */
import { useField } from "formik";
import PropType from "prop-types";
import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
const CustomMobileInput = (props) => {
  const [field, meta, helpers] = useField(props);
  const { label, placeholder, defaultValue } = props;
  const { touched, error } = meta;
  const { setValue } = helpers;

  const handleChange = (value) => {
    if (!value) return;
    const mob = {
      dialCode: value.split(" ")[1],
      countryCode: value.split(" ")[0],
      country: "lebanon",
      value,
    };
    console.log(mob);
    setValue(mob);
  };
  return (
    <div className="input-group">
      {touched && error ? (
        <span className="label-input label-error">
          {error?.value || error?.dialCode}
        </span>
      ) : (
        <label className="label-input" htmlFor={field.name}>
          {label}
        </label>
      )}
      <PhoneInput
        defaultCountry="lb"
        inputStyle={{
          width: "100%",
          backgroundColor: "#f9f9f9",
          borderRadius: 0,
        }}
        onChange={(phone) => handleChange(phone)}
      />
    </div>
  );
};

CustomMobileInput.defaultProps = {
  label: "Mobile Number",
  placeholder: "09254461351",
};

CustomMobileInput.propTypes = {
  label: PropType.string,
  placeholder: PropType.string,
  defaultValue: PropType.object.isRequired,
};

export default CustomMobileInput;
