import React from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Label from './Label';
import Hint from './Hint';
import ErrorMessage from './ErrorMessage';
import Fieldset from './Fieldset';

const FieldsetWrapper = ({ children, ...attributes }) => {
  if (isEmpty(attributes)) {
    return children;
  }
  return <Fieldset {...attributes}>{children}</Fieldset>;
};

const FormGroup = ({
  inputId, className, label, hint, errorMessage, describedBy, fieldset, children, ...attributes
}) => {
  let hintWithId;
  let errorMessageWithId;
  let labelWithId;
  const describeByElements = [describedBy];

  if (hint) {
    const hintId = inputId ? `${inputId}-hint` : '';
    describeByElements.push(hintId);

    hintWithId = typeof hint === 'string' || React.isValidElement(hint)
      ? <Hint id={hintId}>{hint}</Hint>
      : <Hint id={hintId} {...hint} />;
  }

  if (errorMessage) {
    const errorId = inputId ? `${inputId}-error` : '';
    describeByElements.push(errorId);
    errorMessageWithId = typeof errorMessage === 'string' || React.isValidElement(errorMessage)
      ? <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
      : <ErrorMessage id={errorId} {...errorMessage} />;
  }

  if (label) {
    labelWithId = typeof label === 'string' || React.isValidElement(label)
      ? <Label htmlFor={inputId}>{label}</Label>
      : <Label htmlFor={inputId} {...label} />;
  }

  return (
    <div className={classNames(className, 'govuk-form-group', { 'govuk-form-group--error': errorMessage })} {...attributes}>
      <FieldsetWrapper {...fieldset}>
        {labelWithId}
        {hintWithId}
        {errorMessageWithId}
        {typeof children === 'function'
          ? children({ formGroupDescribeBy: describeByElements.join(' ') })
          : children}
      </FieldsetWrapper>
    </div>
  );
};

export default FormGroup;
