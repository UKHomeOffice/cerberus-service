const config = {
  keycloak: {
    mock: JSON.parse(process.env.MOCK_KEYCLOAK || false),
    clientConfig: {
      realm: process.env.KEYCLOAK_REALM || 'cop-dev',
      url: process.env.KEYCLOAK_AUTH_URL || 'https://sso-dev.notprod.homeoffice.gov.uk/auth',
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'cerberus',
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false,
    },
  }
};

export default config;

