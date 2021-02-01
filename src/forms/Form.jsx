import React, { useRef } from 'react';

import { FormContext } from './formContext';
import useForm from '../forms/useForm';
import LoadingSpinner from './LoadingSpinner';
import FormErrors from './FormErrors';

function Form({
  id,
  defaultValues = {},
  onSubmit = null,
  onSuccess = null,
  onCancel = null,
  scrollToTop = true,
  showErrorSummary = true,
  children = null,
}) {
  const formInstance = useForm({
    id,
    defaultValues,
    onSubmit,
    onSuccess,
    onCancel,
    scrollToTop,
  });

  const ref = useRef();

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(formInstance);
    }
    return children;
  }

  return (
    <FormContext.Provider value={formInstance}>
      <form
        id={id}
        ref={ref}
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault()
          formInstance.goForward();
        }}
      >
        <LoadingSpinner loading={formInstance.isLoading}>
          {showErrorSummary && <FormErrors />}
          {renderChildren()}
        </LoadingSpinner>
      </form>
    </FormContext.Provider>
  )
}

export default Form
