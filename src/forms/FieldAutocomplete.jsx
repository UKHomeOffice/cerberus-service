import React from 'react';
import Autocomplete from 'accessible-autocomplete/react';
import useField from './useField';
import FormGroup from '../govuk/FormGroup';

import './__assets__/FieldAutocomplete.scss';

const FieldAutocomplete = ({
  id, name, label, hint, defaultValue = '', validate, required, options, templates, formGroup = {}, ...props
}) => {
  const {
    value, error, setFieldValue,
  } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  const inputId = id || `field-${name}`;

  const optionsCallback = (query, populateResults) => {
    populateResults(query
      ? options.filter((result) => {
        return result.label.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      })
      : []);
  };

  const sourceCallback = Array.isArray(options) ? optionsCallback : options;

  const valueTemplate = (result) => {
    if (!result || !result.value) {
      return;
    }
    return result.label;
  };

  const suggestionTemplate = (result) => {
    if (!result || !result.label) {
      return 'Loading...';
    }
    return result.label;
  };

  return (
    <FormGroup inputId={inputId} hint={hint} label={label} errorMessage={error} {...formGroup}>
      <Autocomplete
        id={inputId}
        onConfirm={(result) => {
          if (result !== undefined) {
            setFieldValue(name, result);
          }
        }}
        defaultValue={value.label}
        source={sourceCallback}
        showNoOptionsFound
        showAllValues
        templates={templates || {
          inputValue: valueTemplate,
          suggestion: suggestionTemplate,
        }}
        {...props}
      />
    </FormGroup>
  );
};

export default FieldAutocomplete;
