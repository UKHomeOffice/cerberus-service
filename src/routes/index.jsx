import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import HomePage from './HomePage';
import { useKeycloak } from '../utils/keycloak';
import Layout from '../components/Layout';

export const AppRouter = () => {
  const keycloak = useKeycloak()

  initAll();

  if (!keycloak) {
    return null;
  }

  return (
    <Layout>
      <BrowserRouter>
        <Route path="/" component={HomePage} />
      </BrowserRouter>
    </Layout>
  )
}

export default AppRouter
