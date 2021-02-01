import React from 'react';

import useField from '../forms/useField';
import Input from '../govuk/Input';

const FieldInput = ({
  id,
  name,
  type,
  validate,
  required,
  defaultValue,
  ...attributes
}) => {
  const { value, error, onChange, onBlur } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  return (
    <Input
      key={name}
      id={id || `field-${name}`}
      type={type}
      name={name}
      defaultValue={value || defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      errorMessage={error}
      {...attributes}
    />
  );
};

export default FieldInput;
