import React from 'react';
import { Link } from 'gatsby';
import { useLocale } from '../providers/locale';
import locales from '../../config/i18n';

// Use the globally available context to choose the right path
const LocalizedLink = ({ to, localeText, children, ...props }) => {
  const { locale } = useLocale();
  const isIndex = to === `/`;
  // If it's the default language, don't do anything
  // If it's another language, add the "path"
  // However, if the homepage/index page is linked don't add the "to"
  // Because otherwise this would add a trailing slash
  const path = locales[locale].default
    ? to
    : `/${locale}${isIndex ? `` : `${to}`}`;

  return <Link {...props} to={path}>{locales[locale].default? children: localeText}</Link>;
};

export default LocalizedLink;
