import React, { useRef } from 'react';
import { useDeepCompareEffect } from 'react-use';
import classNames from 'classnames';

const ErrorSummary = ({ title, description, className, errorList = [], onHandleErrorClick, ...attributes }) => {
  const ref = useRef();

  useDeepCompareEffect(() => {
    ref?.current?.focus();
  }, [errorList]);

  return (
    <div
      ref={ref}
      className={classNames(className, 'govuk-error-summary')}
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
      data-module="govuk-error-summary"
      {...attributes}
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {title}
      </h2>
      <div className="govuk-error-summary__body">
        {description}
        <ul className="govuk-list govuk-error-summary__list">
          {errorList.map((error, index) => (
            <li key={index}>
              <a
                href={`#${error.targetName}`}
                onClick={(e) => {
                  e.preventDefault();
                  onHandleErrorClick(error.targetName);
                }} {...error.attributes}>
                {error.children}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorSummary;
