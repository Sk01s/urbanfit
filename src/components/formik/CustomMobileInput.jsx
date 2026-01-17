/* eslint-disable react/forbid-prop-types */
import { useField } from "formik";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const CustomMobileInput = (props) => {
  const [field, meta, helpers] = useField(props);
  const { label, placeholder, defaultValue } = props;
  const { touched, error } = meta;
  const { setValue } = helpers;
  
  // Get the initial phone value from defaultValue or field value
  const getInitialPhone = () => {
    // Check field value first (from Formik)
    if (field.value?.value) {
      return field.value.value;
    }
    // Then check defaultValue prop
    if (defaultValue?.value) {
      return defaultValue.value;
    }
    return "";
  };

  const [phoneValue, setPhoneValue] = useState(getInitialPhone());

  // Update phoneValue when defaultValue changes (e.g., when profile loads)
  useEffect(() => {
    const initialPhone = getInitialPhone();
    if (initialPhone && initialPhone !== phoneValue) {
      setPhoneValue(initialPhone);
      // Also set the Formik value if it's not already set
      if (!field.value?.value && defaultValue?.value) {
        setValue(defaultValue);
      }
    }
  }, [defaultValue?.value, field.value?.value]);

  const handleChange = (value) => {
    if (!value) return;
    setPhoneValue(value);
    
    // Parse the phone number components
    const parts = value.split(" ");
    const countryCode = parts[0] || "";
    const dialCode = parts.slice(1).join(" ") || value;
    
    const mob = {
      dialCode: dialCode,
      countryCode: countryCode,
      country: "lebanon",
      value: value,
    };
    setValue(mob);
  };

  return (
    <div
      className="input-group"
      style={{ marginRight: window.innerWidth <= 480 ? "0" : "1.2rem" }}
    >
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
        value={phoneValue}
        inputStyle={{
          width: "100%",
          backgroundColor: "#fff",
        }}
        onChange={(phone) => handleChange(phone)}
      />
    </div>
  );
};

CustomMobileInput.defaultProps = {
  label: "Mobile",
  placeholder: "09254461351",
  defaultValue: {},
};

CustomMobileInput.propTypes = {
  label: PropType.string,
  placeholder: PropType.string,
  defaultValue: PropType.object,
};

export default CustomMobileInput;
