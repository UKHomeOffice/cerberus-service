/**
 * React implementation of GOV.UK Design System Radios
 * Demo: https://design-system.service.gov.uk/components/radios/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/radios/README.md
 */

import React from 'react';
import classNames from 'classnames';

import Hint from './Hint';
import Label from './Label';
import FormGroup from './FormGroup';

const Radios = ({
  id, name, legend, fieldset = {}, items, className, defaultValue, inline = false, formGroup = {}, errorMessage, hint, describedBy, idPrefix, ...attributes
}) => {
  const isConditional = !!items.find((item) => item.conditional);

  return (
    <FormGroup inputId={id} hint={hint} fieldset={{ legend, ...fieldset }} errorMessage={errorMessage} describedBy={describedBy} {...formGroup}>
      {({ formGroupDescribedBy }) => (
        <div
          className={classNames('govuk-radios', className, {
            'govuk-radios--conditional': isConditional,
            'govuk-radios--inline': inline,
          })}
          aria-describedby={formGroupDescribedBy}
        >
          {items.map((item, index) => {
            const idSuffix = `-${index + 1}`;
            const itemId = item.id ? item.id : `${idPrefix || name}${index === 0 ? '' : idSuffix}`;
            const key = item.reactListKey || index;
            const conditionalId = item.conditional ? `conditional-${itemId}` : null;
            const itemHintId = `${itemId}-item-hint`;
            const itemChecked = item.value === defaultValue;

            if (item.divider) {
              return <div key={key} className="govuk-radios__divider">{item.divider}</div>;
            }

            return (
              <React.Fragment key={key}>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id={itemId}
                    name={item.name ? item.name : name}
                    type="radio"
                    value={item.value}
                    defaultChecked={itemChecked}
                    data-aria-controls={conditionalId}
                    aria-describedby={item.hint ? itemHintId : null}
                    disabled={item.disabled}
                    {...attributes}
                    {...item.attributes}
                  />
                  <Label className="govuk-radios__label" htmlFor={itemId}>{item.label}</Label>
                  {item.hint ? <Hint className="govuk-radios__hint" {...item.hint} id={itemHintId} /> : ''}
                </div>

                {item.conditional && itemChecked && (
                  <div
                    className="govuk-radios__conditional"
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
};

export default Radios;
