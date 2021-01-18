exports.removeTrailingSlash = path =>
  path === `/` ? path : path.replace(/\/$/, ``);

exports.localizedSlug = ({ isDefaultLang, locale, slug }) => {
  return isDefaultLang ? `${slug}` : `${locale}${slug}`;
};