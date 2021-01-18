import React from 'react';
import { navigate } from "gatsby";
import { useLocale } from '../providers/locale';

const Languages = () => {
  // Grab the locale (passed through context) from the Locale Provider 
  // through useLocale() hook
  const { locale } = useLocale();

  function handleClickLanguage(e, lang) {
    e.preventDefault();
    if (locale === lang) return;

    const url = window.location.pathname;

    if (url === "/") return lang === "en" ?
      navigate(`/`) :
      navigate(`/${lang}`);

    const hasLocale = window.location.pathname.split("/")[1] === "zh"

    if (hasLocale){ return lang === "en" ? 
      navigate(`${url.replace("/zh", "")}`) :
      navigate(`${url}`)
    }

    return lang === "en" ?
      navigate(`${url}`) :
      navigate(`/${lang}${url}`);
  }

  return (
    <div>
      <div>
        <button
          onClick={(e) => handleClickLanguage(e, "en")}
          className={locale === 'en' ? 'is-active' : ''}
        >
          EN
        </button>
      </div>
      <div>
        <button 
          onClick={(e) => handleClickLanguage(e, "zh")}
          className={locale === 'zh' ? 'is-active' : ''}
        >
          ZH
        </button>
      </div>
    </div>
  );
};

export default Languages;
