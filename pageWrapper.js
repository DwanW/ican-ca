import React, {useEffect} from 'react';
import { useLocale } from './src/providers/locale'

const PageWrapper = ({ children, pageContext: { locale } }) => {
    const { changeLocale } = useLocale();

    changeLocale(locale)
    
    return (
        <>
            {children}
        </>
    )
}

export { PageWrapper }