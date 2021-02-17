import React from 'react';
import { translations, TranslationKeys } from './translations';
import { ThemePropertyType, themes } from './themes';
import { getThemeStyles } from '../assets/styles/style';
import { AppContextState } from '../redux/reducerTypes';

export const defaultAppContext = {
  language: translations.en,
  theme: themes.dark,
  styles: getThemeStyles(themes.dark),
  locale: 'en',
  otherSettings: {
    hideNoteText: false
  }
} as AppContextState;

export const AppContext = React.createContext(defaultAppContext);