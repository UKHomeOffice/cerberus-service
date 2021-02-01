import React from 'react'
import classNames from 'classnames';

const ErrorMessage = ({ className, visuallyHiddenText = 'Error', children, ...attributes }) => (
  <span className={classNames(className, 'govuk-error-message')} {...attributes}>
    {visuallyHiddenText && <span className="govuk-visually-hidden">{visuallyHiddenText}</span>}
    {children}
  </span>
);

export default ErrorMessage;
