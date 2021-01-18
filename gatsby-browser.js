const React = require("react")
const { LocaleProvider } = require("./src/providers/locale")
const { PageWrapper } = require('./pageWrapper')


exports.wrapPageElement = ({element, props}) => {
    return (
        <LocaleProvider>
            <PageWrapper {...props}>{element}</PageWrapper>
        </LocaleProvider>
    )
}

