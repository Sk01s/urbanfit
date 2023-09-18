/* eslint-disable react/forbid-prop-types */
import { useField } from "formik";
import PropType from "prop-types";
import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
const CustomMobileInput = (props) => {
  const [field, meta, helpers] = useField(props);
  const { label, placeholder, defaultValue } = props;
  const { touched, error } = meta;
  const { setValue } = helpers;

  const handleChange = (value, data) => {
    if (!value) return;
    const mob = {
      dialCode: parseInt(value?.slice(4)),
      countryCode: 961,
      country: "lebanon",
      value,
    };

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
        name={field.name}
        value={"+961"}
        ClassName="input-form d-block"
        onChange={handleChange}
        placeholder={placeholder}
        required="true"
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
