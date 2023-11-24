import i18n from 'i18next'
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    fallbackLng: 'vn',
    lng: 'vn',
    resources: {
        en: {
            translations: require('./locales/en/translations.json')
        },
        vn: {
            translations: require('./locales/vn/translations.json')
        }
    },
    ns: ['translations'],
    defaultNS: 'translations'
});

i18n.languages = ['en', 'vn'];

export default i18n;