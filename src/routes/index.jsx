import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../utils/keycloak';
import Layout from '../components/Layout';
import HomePage from './HomePage';
import IssueTargetPage from './IssueTargetPage';

export const AppRouter = () => {
  const keycloak = useKeycloak()

  initAll();

  if (!keycloak) {
    return null;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact component={HomePage} />
        <Route path="/issue-target" exact component={IssueTargetPage} />
      </Layout>
    </BrowserRouter>
  )
};

export default AppRouter;
