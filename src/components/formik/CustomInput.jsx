/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import PropType from "prop-types";
import React, { useEffect, useRef } from "react";

const CustomInput = ({
  field,
  form: { touched, errors },
  label,
  inputRef,
  ...props
}) => {
  const localeInputRef = useRef();
  const labelRef = useRef();
  const handleLabel = () => {
    labelRef.current.classList.add("active");
    errorLabelRef.current.classList.add("active");
  };
  useEffect(() => {
    labelRef.current?.classList?.add("active");
  }, [localeInputRef.current?.value, touched[field.name], errors[field.name]]);

  return (
    <div className="input-group">
      <input
        type="text"
        id={field.name}
        className={`input-form ${
          touched[field.name] && errors[field.name] && "input-error"
        }`}
        onFocus={handleLabel}
        ref={(e) => {
          inputRef = e;
          localeInputRef.current = e;
        }}
        {...field}
        {...props}
      />
      {touched[field.name] && errors[field.name] ? (
        <span ref={labelRef} className="label-input label-error">
          {errors[field.name]}
        </span>
      ) : (
        <label ref={labelRef} className="label-input" htmlFor={field.name}>
          {label}
        </label>
      )}
    </div>
  );
};

CustomInput.defaultProps = {
  inputRef: undefined,
};

CustomInput.propTypes = {
  label: PropType.string.isRequired,
  field: PropType.object.isRequired,
  form: PropType.object.isRequired,
  inputRef: PropType.oneOfType([
    PropType.func,
    PropType.shape({ current: PropType.instanceOf(Element) }),
  ]),
};

export default CustomInput;
