import React, { createContext, useState, useContext, useEffect } from 'react';
import Keycloak from 'keycloak-js';

import config from '../config';

const KeycloakContext = createContext();

const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);

  const keycloakInstance = Keycloak(config.keycloak.clientConfig);

  useEffect(() => {
    if (config.keycloak.mock) {
      setKeycloak({
        createLogoutUrl: () => '',
        loadUserInfo: () => Promise.resolve({ name: 'Cerberus' }),
      });
    } else {
      keycloakInstance.init(config.keycloak.initOptions).then(authenticated => {
        if (authenticated) {
          setKeycloak(keycloakInstance);
        } else {
          keycloakInstance.login();
        }
      });
    }
  }, []);

  return <KeycloakContext.Provider value={keycloak}>{children}</KeycloakContext.Provider>;
};

const useKeycloak = () => useContext(KeycloakContext);

export { KeycloakContext, KeycloakProvider, useKeycloak };
