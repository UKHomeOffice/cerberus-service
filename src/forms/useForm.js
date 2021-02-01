import { useEffect, useState } from 'react';
import { isEmpty, isEqual, omit } from 'lodash';
import { useDeepCompareEffect } from 'react-use';

function useForm({
  id,
  defaultValues = {},
  onSubmit = null,
  onSuccess = null,
  onCancel = null,
  scrollToTop = true,
} = {}) {
  const rawStorage = localStorage.getItem(id);
  const storage = rawStorage ? JSON.parse(rawStorage) : {};
  const [values, setValues] = useState(storage?.values || defaultValues)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({})
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(storage?.currentStep || 0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)
  const isDirty = !isEmpty(values) && !isEqual(values, defaultValues)

  const formState = {
    id,
    values,
    touched,
    errors,
    fields,
    steps,
    currentStep,
    isLoading,
    isSubmitted,
    isDirty,
    submissionError,
  }

  const clearStorage = () => localStorage.setItem(id, null);

  useDeepCompareEffect(() => {
    localStorage.setItem(id, JSON.stringify({
      values,
      currentStep,
    }));
  }, [currentStep, values]);

  useDeepCompareEffect(() => {
    if (scrollToTop) {
      window.scrollTo(0, 0)
    }
  }, [currentStep, errors, isSubmitted])

  const getFieldState = (name) => {
    return {
      value: values[name] || '',
      touched: touched[name] || false,
      error: errors[name] || null,
    }
  }

  const validateField = (name) => {
    const field = fields[name]
    const value = values[name]

    if (!field) {
      throw new Error(`Field ${name} does not exist`)
    }

    if (field && 'validate' in field) {
      if (typeof field.validate === 'function') {
        return field.validate(value, name, formState)
      }

      if (Array.isArray(field.validate)) {
        const validationErrors = field.validate
          .map((validator) => validator(value, field, formState))
          .filter((e) => e)
        return validationErrors.length > 0 ? validationErrors[0] : null
      }
    }

    return null
  }

  const validateForm = (fieldNames = []) => {
    const fieldsToValidate =
      fieldNames.length > 0 ? fieldNames : Object.keys(fields)
    const newErrors = {}
    const newTouched = {}

    fieldsToValidate.forEach((name) => {
      const error = validateField(name)
      if (error) {
        newErrors[name] = error
      }
      newTouched[name] = true
    })

    setErrors(newErrors)
    setTouched(newTouched)

    return newErrors
  }

  const setFieldValue = (name, fieldValue) =>
    setValues((prevValues) => {
      if (fieldValue === '') {
        return omit(prevValues, name)
      }

      return { ...prevValues, [name]: fieldValue }
    })
  const setFieldTouched = (name, fieldTouched) => {
    setTouched((prevTouched) => ({ ...prevTouched, [name]: fieldTouched }))
  }
  const setFieldError = (name, error) =>
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))

  const registerField = (field) =>
    setFields((prevFields) => {
      const { name, defaultValue } = field

      if (defaultValue) {
        setFieldValue(name, defaultValue)
      }

      setFieldTouched(name, false)

      if (!(name in prevFields)) {
        return {
          ...prevFields,
          [name]: field,
        }
      }
      return prevFields
    })

  const deregisterField = (name) => {
    setFields((prevFields) => {
      const newFields = { ...prevFields }
      delete newFields[name]
      return newFields
    })
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      delete newErrors[name]
      return newErrors
    })
    setTouched((prevTouched) => {
      const newTouched = { ...prevTouched }
      delete newTouched[name]
      return newTouched
    })
  }

  const registerStep = (name) => {
    setSteps((prevSteps) => {
      if (!prevSteps.includes(name)) {
        const newSteps = [...prevSteps]
        newSteps.push(name)
        return newSteps
      }
      return prevSteps
    })
  }
  const deregisterStep = (name) =>
    setSteps((prevSteps) => prevSteps.filter((s) => s !== name))

  const isFirstStep = () => currentStep === 0
  const isLastStep = () =>
    currentStep === steps.length - 1 || steps.length === 0

  const submitForm = async () => {
    try {
      setIsLoading(true)

      if (typeof onSubmit === 'function') {
        await onSubmit(values)
      }

      setIsLoading(false)
      setIsSubmitted(true)
      clearStorage()

      if (typeof onSuccess === 'function') {
        await onSuccess(values)
      }
    } catch (e) {
      setSubmissionError(e)
      setIsLoading(false)
    }
  }

  const getStepIndex = (stepName) => {
    const index = steps.indexOf(stepName)
    return index !== -1 ? index : null
  }

  const goForward = async () => {
    const validationErrors = validateForm();

    if (!isEmpty(validationErrors)) {
      return
    }

    if (!isLastStep()) {
      setCurrentStep(currentStep + 1)
      return
    }

    await submitForm()
  }

  const goBack = () => setCurrentStep(currentStep - 1)

  const cancel = async () => {
    clearStorage();

    if (typeof onCancel === 'function') {
      await onCancel()
    }
  }

  const goToStepByName = (stepName) => setCurrentStep(steps.indexOf(stepName))

  return {
    ...formState,
    registerField,
    deregisterField,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    getFieldState,
    validateForm,
    validateField,
    registerStep,
    deregisterStep,
    setCurrentStep,
    setIsLoading,
    setIsSubmitted,
    goForward,
    goBack,
    cancel,
    goToStepByName,
    getStepIndex,
    isLastStep,
    isFirstStep,
  }
}

export default useForm
