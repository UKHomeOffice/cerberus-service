import { isEmpty } from 'lodash';

export const LONG_DATE_PATTERN = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
export const SHORT_DATE_PATTERN = /^(\d{4})(\/|-)(\d{1,2})$/;
export const TIME_PATTERN = /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const requireValue = (errorMessage) => (value) => {
  const isPrimitiveValue = value !== Object(value);
  if (isPrimitiveValue) {
    return !value || isEmpty(String(value).trim()) ? errorMessage : null;
  }
  if (value instanceof Object) {
    return !Object.values(value).some(Boolean) ? errorMessage : null;
  }
  return isEmpty(value) ? errorMessage : null;
};

export const validShortDate = (errorMessage) => ({
  year, month, hour, minute,
} = {}) => {
  const empty = !year && !month && !hour && !minute;
  return empty || `${year}/${month}`.match(SHORT_DATE_PATTERN) ? null : errorMessage;
};

export const validLongDate = (errorMessage) => ({
  year, month, day, hour, minute,
} = {}) => {
  const empty = !year && !month && !day && !hour && !minute;
  return empty || `${year}/${month}/${day}`.match(LONG_DATE_PATTERN) ? null : errorMessage;
};

export const validTime = (errorMessage) => ({ hour, minute } = {}) => {
  const empty = !hour && !minute;
  return empty || `${hour}:${minute}`.match(TIME_PATTERN) ? null : errorMessage;
};
