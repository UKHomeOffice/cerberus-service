import React, { useEffect, useState } from 'react';
import { useKeycloak } from '../../utils/keycloak';

const Home = () => {
  const keycloak = useKeycloak();
  const [user, setUser] = useState(null);

  useEffect(() => {
    keycloak.loadUserInfo().then(setUser);
  }, [])

  if (!user) {
    return null;
  }

  return (
    <p className="govuk-body">Hello {user.name}!</p>
  );
};

export default Home;

