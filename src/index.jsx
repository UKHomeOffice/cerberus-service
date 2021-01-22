import React from 'react';
import { render } from 'react-dom';
import AppRouter from './routes';
import { KeycloakProvider } from './utils/keycloak';

render(
  <KeycloakProvider>
    <AppRouter />
  </KeycloakProvider>,
  document.getElementById('root'),
)
