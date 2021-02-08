import React from 'react';

import useField from './useField';
import Checkboxes from '../govuk/Checkboxes';

const FieldCheckboxes = ({
  id,
  name,
  type,
  validate,
  required,
  defaultValue,
  ...attributes
}) => {
  const {
    value, setFieldValue, error,
  } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  const onChange = (e) => {
    const { value: optionValue, checked } = e.target;
    let newValue = Array.isArray(value) ? [...value] : [];

    if (checked) {
      newValue.push(optionValue);
    } else if (newValue.includes(optionValue)) {
      newValue = newValue.filter((item) => item !== optionValue);
    }

    setFieldValue(name, newValue);
  };

  return (
    <Checkboxes
      key={name}
      id={id || `field-${name}`}
      name={name}
      defaultValue={value}
      onChange={onChange}
      errorMessage={error}
      {...attributes}
    />
  );
};

export default FieldCheckboxes;
