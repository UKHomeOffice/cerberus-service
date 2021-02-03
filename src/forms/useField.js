import { useEffect } from 'react';
import { isEmpty } from 'lodash';

import { useFormContext } from './formContext';

const useField = ({
  name,
  defaultValue = '',
  validate = null,
  required = null,
}) => {
  const {
    registerField,
    deregisterField,
    setFieldValue,
    getFieldState,
  } = useFormContext();

  function prepareValidators() {
    const validators = Array.isArray(validate)
      ? validate
      : [validate].filter((v) => v);

    if (required) {
      validators.unshift((value) => (isEmpty(value) ? required : null));
    }

    return validators;
  }

  useEffect(() => {
    registerField({ name, defaultValue, validate: prepareValidators() });

    return () => {
      deregisterField(name);
    };
  }, [name]);

  const fieldState = getFieldState(name);

  return {
    name,
    value: fieldState.value,
    error: fieldState.error,
    onChange: (e) => setFieldValue(name, e.target.value),
    setFieldValue,
  };
};

export default useField;
