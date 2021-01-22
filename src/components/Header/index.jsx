import React from 'react';
import { useKeycloak } from '../../utils/keycloak';

const Header = () => {
  const { createLogoutUrl } = useKeycloak();
  return (
    <header className="govuk-header " role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__content">
          <a href="#" className="govuk-header__link govuk-header__link--homepage">
            Cerberus
            <span style={{display: "block", fontSize: "10pt"}}>powered by the Central Operations Platform</span>
          </a>
          <nav>
            <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
              <li className="govuk-header__navigation-item">
                <a href={createLogoutUrl()} className="govuk-header__link">Sign out</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
};

export default Header;
