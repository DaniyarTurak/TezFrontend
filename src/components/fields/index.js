import React, { Fragment } from "react";
import Select from "react-select";
export const InputField = (props) => {
  const {
    input,
    type,
    onWheel,
    className,
    placeholder,
    autocomplete,
    tabIndex,
    disabled,
    meta: { touched, error },
  } = props;

  if (type === "plainText") {
    return input.value;
  }

  return (
    <Fragment>
      <input
        {...input}
        type={type}
        autoComplete={autocomplete}
        className={className}
        placeholder={placeholder}
        tabIndex={tabIndex}
        disabled={disabled}
        onWheel={onWheel}
      />

      {error && touched && <span className="message text-danger">{error}</span>}
    </Fragment>
  );
};

export const InputGroup = (props) => {
  const {
    input,
    onKeyDown,
    onWheel,
    type,
    className,
    placeholder,
    autocomplete,
    tabIndex,
    ref,
    disabled,
    pattern,
    prependItem,
    appendItem,
    meta: { touched, error },
  } = props;

  if (type === "plainText") {
    return input.value;
  }

  return (
    <Fragment>
      <div className="input-group">
        {prependItem && (
          <div className="input-group-prepend">{prependItem}</div>
        )}

        <input
          {...input}
          value={input.value}
          type={type}
          autoComplete={autocomplete}
          onKeyDown={onKeyDown}
          onWheel={onWheel}
          className={className}
          placeholder={placeholder}
          ref={ref}
          tabIndex={tabIndex}
          disabled={disabled}
          pattern={pattern}
        />
        {appendItem && <div className="input-group-append">{appendItem}</div>}
      </div>

      {error && touched && <span className="message text-danger">{error}</span>}
    </Fragment>
  );
};

export const SelectField = (props) => {
  const {
    input,
    options,
    placeholder,
    noOptionMessage,
    onInputChange,
    isMulti,
    disabled,
    meta: { touched, error },
  } = props;

  const optionsToRender = options.map((option) => {
    return {
      label: option.value || option.name || option.label,
      value: option.id || option.value,
      code: option.code || "",
      attributes: option.attributes || "",
      isDisabled: option.isDisabled || false,
    };
  });

  return (
    <Fragment>
      <Select
        {...input}
        isDisabled={disabled}
        onInputChange={onInputChange}
        onChange={input.onChange}
        onBlur={() => input.onBlur(input.value)}
        options={optionsToRender}
        isMulti={isMulti}
        noOptionsMessage={() => noOptionMessage || "Не найдено"}
        placeholder={placeholder || "Выберите"}
      />
      {error && touched && <span className="message text-danger">{error}</span>}
    </Fragment>
  );
};

export const SelectFieldCategory = (props) => {
  const {
    input,
    options,
    placeholder,
    noOptionMessage,
    onInputChange,
    isMulti,
    meta: { touched, error },
  } = props;

  const optionsToRender = options.map((option) => {
    return {
      label: option.name || option.label,
      value: option.id || option.value,
    };
  });

  return (
    <Fragment>
      <Select
        {...input}
        onInputChange={onInputChange}
        onChange={input.onChange}
        onBlur={() => input.onBlur(input.value)}
        options={optionsToRender}
        isMulti={isMulti}
        noOptionsMessage={() => noOptionMessage || "Не найдено"}
        placeholder={placeholder || "Выберите"}
      />

      {error && touched && <span className="message text-danger">{error}</span>}
    </Fragment>
  );
};

export const SelectFieldRadio = (props) => {
  const {
    input,
    options,
    placeholder,
    noOptionMessage,
    onInputChange,
    isMulti,
    meta: { touched, error },
  } = props;

  const optionsToRender = options.map((option) => {
    return {
      label: option.value || option.name || option.label,
      value: option.id || option.value,
      code: option.code || "",
      attributes: option.attributes || "",
    };
  });

  return (
    <Fragment>
      <Select
        {...input}
        value={input.value}
        onInputChange={onInputChange}
        onChange={input.onChange}
        onBlur={() => input.onBlur(input.value)}
        options={optionsToRender}
        isMulti={isMulti}
        noOptionsMessage={() => noOptionMessage || "Не найдено"}
        placeholder={placeholder || "Выберите"}
      />

      {error && touched && <span className="message text-danger">{error}</span>}
    </Fragment>
  );
};
