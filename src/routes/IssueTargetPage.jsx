import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formio, Form } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template/lib';
import { isEmpty } from 'lodash';

import config from '../config';
import Panel from '../govuk/Panel';
import useAxiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../forms/LoadingSpinner';
import { useKeycloak } from '../utils/keycloak';
import {
  augmentRequest,
  interpolate,
  useFormSubmit,
} from '../utils/formioSupport';
import ErrorSummary from '../govuk/ErrorSummary';

Formio.use(gds);

const IssueTargetPage = () => {
  const formId = '59ae1bdd-f2a5-475a-ad5f-4b5cd4cd0a95';
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [formIsLoading, setFormIsLoading] = useState(true);
  const submitForm = useFormSubmit();
  const keycloak = useKeycloak();
  const formApiClient = useAxiosInstance(config.formApiUrl);

  Formio.plugins = [augmentRequest(keycloak)];

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadForm = async () => {
      if (formApiClient) {
        try {
          const formResponse = await formApiClient.get(`/form/${formId}`);
          setForm(formResponse.data);
        } catch (e) {
          setForm(null);
        } finally {
          setFormIsLoading(false);
        }
      }
    };

    loadForm();
    return () => {
      source.cancel('Cancelling request');
    };
  }, [formId, formApiClient]);

  if (success) {
    return <Panel title="Form submitted">Thank you for submitting the target information sheet.</Panel>;
  }

  if (!isEmpty(form)) {
    interpolate(form, {
      keycloakContext: {
        accessToken: keycloak.token,
        refreshToken: keycloak.refreshToken,
        sessionId: keycloak.tokenParsed.session_state,
        email: keycloak.tokenParsed.email,
        givenName: keycloak.tokenParsed.given_name,
        familyName: keycloak.tokenParsed.family_name,
        subject: keycloak.subject,
        url: keycloak.authServerUrl,
        realm: keycloak.realm,
        roles: keycloak.tokenParsed.realm_access.roles,
        groups: keycloak.tokenParsed.groups,
      },
      environmentContext: {
        referenceDataUrl: config.refdataApiUrl,
      },
    });
  }

  return (
    <>
      <LoadingSpinner loading={formIsLoading}>
        {error && (
          <ErrorSummary
            title="There is a problem"
            errorList={[
              { children: error },
            ]}
          />
        )}
        {!isEmpty(form) && (
          <Form
            form={form}
            onSubmit={async (data) => {
              setFormIsLoading(true);
              await submitForm(
                'assignTarget',
                data.data.businessKey,
                form,
                data,
                (e) => setError(e.message),
              );
              setSuccess(true);
              setFormIsLoading(false);
            }}
          />
        )}
      </LoadingSpinner>
    </>
  );
};

export default IssueTargetPage;
