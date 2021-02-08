/**
 * React implementation of GOV.UK Design System Checkboxes
 * Demo: https://design-system.service.gov.uk/components/checkboxes/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/checkboxes/README.md
 */

import React from 'react';
import classNames from 'classnames';

import Hint from './Hint';
import Label from './Label';
import FormGroup from './FormGroup';

const Checkboxes = ({
  id, name, legend, fieldset = {}, items, className, defaultValue = [], formGroup = {}, errorMessage, hint, describedBy, idPrefix, ...attributes
}) => (
  <FormGroup inputId={id} hint={hint} fieldset={{ legend, ...fieldset }} errorMessage={errorMessage} describedBy={describedBy} {...formGroup}>
    {({ formGroupDescribedBy }) => (
      <div
        className={classNames('govuk-checkboxes', className)}
        aria-describedby={formGroupDescribedBy}
      >
        {items.map((item, index) => {
          const idSuffix = `-${index + 1}`;
          const itemId = item.id ? item.id : `${idPrefix || name}${index === 0 ? '' : idSuffix}`;
          const key = item.reactListKey || index;
          const conditionalId = item.conditional ? `conditional-${itemId}` : null;
          const itemHintId = `${itemId}-item-hint`;
          const itemChecked = defaultValue.includes(item.value);

          return (
            <React.Fragment key={key}>
              <div className="govuk-checkboxes__item">
                <input
                  className="govuk-checkboxes__input"
                  id={itemId}
                  name={item.name ? item.name : name}
                  type="checkbox"
                  value={item.value}
                  defaultChecked={itemChecked}
                  data-aria-controls={conditionalId}
                  aria-describedby={item.hint ? itemHintId : null}
                  disabled={item.disabled}
                  {...attributes}
                  {...item.attributes}
                />
                <Label className="govuk-checkboxes__label" htmlFor={itemId}>{item.label}</Label>
                {item.hint ? <Hint className="govuk-checkboxes__hint" {...item.hint} id={itemHintId} /> : ''}
              </div>

              {item.conditional && itemChecked && (
              <div
                className="govuk-checkboxes__conditional"
                id={conditionalId}
              >
                {item.conditional}
              </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    )}
  </FormGroup>
);

export default Checkboxes;
