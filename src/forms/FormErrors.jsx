import React from 'react';
import { isEmpty } from 'lodash';

import ErrorSummary from '../govuk/ErrorSummary';
import { useFormContext } from './formContext';

const FormErrors = () => {
  const { errors, submissionError } = useFormContext();

  if (isEmpty(errors) && !submissionError) {
    return null;
  }

  return (
    <ErrorSummary
      title="There is a problem"
      description={isEmpty(errors) ? String(submissionError) : null}
      onHandleErrorClick={(targetName) => {
        const $el =
          document.querySelector(`[name="${targetName}"]`) ??
          document.querySelector(`#field-${targetName} input`) ??
          document.querySelector(`#field-${targetName}`);
        if ($el) {
          $el.scrollIntoView();
          $el.focus();
        }
      }}
      errorList={Object.entries(errors).map(([name, error]) => ({
        targetName: name,
        children: error,
      }))}
    />
  );
};

export default FormErrors;
