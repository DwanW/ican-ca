import React, {useEffect} from 'react';
import { useLocale } from './src/providers/locale'

const PageWrapper = ({ children, pageContext: { locale } }) => {
    const { changeLocale } = useLocale();

    useEffect(() => {
        if(locale) return changeLocale(locale)
    }, [locale, changeLocale])
    
    return (
        <>
            {children}
        </>
    )
}

export { PageWrapper }