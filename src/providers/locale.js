import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const LocaleContext = createContext('');

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  function changeLocale(lang) {
    setLocale(lang);
  }

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

LocaleProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const useLocale = () => {
  const context = useContext(LocaleContext);

  return context;
};

export { LocaleProvider, useLocale };