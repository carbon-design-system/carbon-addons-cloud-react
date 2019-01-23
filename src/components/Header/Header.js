import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ pageTitle, children, className }) => (
  <header className={`contextHeader ${className}`}>
    {pageTitle && <h1 className="pageTitle">{pageTitle}</h1>}
    {children}
  </header>
);
Header.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

Header.defaultProps = {
  pageTitle: null,
  children: null,
  className: '',
};

export default Header;
