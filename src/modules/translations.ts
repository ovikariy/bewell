/* import matching Date and Time locales here for moment JS. Could import them where moment JS is used
e.g. helpers.ts but wanted to keep them next to the translations for consistency */
import 'moment/locale/ru';
import 'moment/locale/fr';
import 'moment/locale/de';

import messages from '../assets/translations/en.json';

export type TranslationKeys = typeof messages;
export const ErrorMessage: TranslationKeys = Object.keys(messages).reduce((result, key) => {
    result[key] = key;
    return result;
}, {} as any);
export type TranslationMap = { [language: string]: TranslationKeys };

export function getTranslationMessage(translation: TranslationKeys, messageId: string): string {
    const message = (translation as any)[messageId];
    return message ?? messageId;
}

export const translations: TranslationMap = {
    en: messages,
    ru: require('../assets/translations/ru.json'),
    fr: require('../assets/translations/fr.json'),
    de: require('../assets/translations/de.json')
};