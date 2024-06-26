/* eslint-disable react/forbid-prop-types */
import { useField } from "formik";
import PropType from "prop-types";
import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const CustomCreatableSelect = (props) => {
  const [field, meta, helpers] = useField(props);
  const {
    options,
    defaultValue,
    label,
    placeholder,
    isMulti,
    type,
    iid,
    creatable,
  } = props;
  const { touched, error } = meta;
  const { setValue } = helpers;

  const handleChange = (newValue) => {
    if (Array.isArray(newValue)) {
      setValue(arr);
    } else {
      setValue(newValue.value);
    }
  };

  const handleKeyDown = (e) => {
    if (type === "number") {
      const { key } = e.nativeEvent;
      if (/\D/.test(key) && key !== "Backspace") {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      className="input-group"
      style={{
        border: touched && error ? "1px solid red" : "1px solid #cacaca",
        marginBottom: "1.2rem",
        borderRadius: ".7rem",
      }}
    >
      {touched && error ? (
        <span
          className="label-input label-error"
          style={{
            position: "absolute",
            top: "1rem",
            fontSize: "1rem",
            zIndex: 1,
            scale: 0.9,
          }}
        >
          {error}
        </span>
      ) : (
        <label
          className="label-input"
          style={{
            position: "absolute",
            top: "1rem",
            fontSize: "1rem",
            scale: 0.9,
            zIndex: 1,
          }}
          htmlFor={field.name}
        >
          {label}
        </label>
      )}
      {creatable ? (
        <CreatableSelect
          isMulti={isMulti}
          placeholder={placeholder}
          name={field.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          defaultValue={defaultValue}
          options={options}
          instanceId={iid}
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 10,
            }),
            container: (provided) => ({
              ...provided,
              marginBottom: "1.2rem",
            }),
            control: (provided) => ({
              ...provided,
              border: touched && error ? "1px solid red" : "1px solid #cacaca",
            }),
          }}
        />
      ) : (
        <Select
          isMulti={isMulti}
          placeholder={placeholder}
          name={field.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          defaultValue={defaultValue}
          options={options}
          instanceId={iid}
          styles={{
            menu: (provided) => ({
              ...provided,
              zIndex: 10,
            }),
            container: (provided) => ({
              ...provided,
            }),
            control: (provided) => ({
              ...provided,
              border: "none",
            }),
          }}
        />
      )}
    </div>
  );
};

CustomCreatableSelect.defaultProps = {
  isMulti: false,
  placeholder: "",
  iid: "",
  options: [],
  type: "string",
};

CustomCreatableSelect.propTypes = {
  options: PropType.arrayOf(PropType.object),
  defaultValue: PropType.oneOfType([PropType.object, PropType.array])
    .isRequired,
  label: PropType.string.isRequired,
  placeholder: PropType.string,
  isMulti: PropType.bool,
  type: PropType.string,
  iid: PropType.string,
};

export default CustomCreatableSelect;
