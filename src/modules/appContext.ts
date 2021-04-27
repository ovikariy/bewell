import React from 'react';
import { translations, TranslationKeys } from './translations';
import { ThemePropertyType, themes } from './themes';
import { getThemeStyles } from '../assets/styles/style';
import { AppContextState } from '../redux/reducerTypes';
import { settingsLists } from './constants';

export const defaultAppContext = {
  language: translations.en,
  theme: themes.dark,
  styles: getThemeStyles(themes.dark),
  locale: 'en',
  otherSettings: {
    hideNoteText: false,
    numAddWidgetButtonsVisible: 5, //TODO: different default on screen sizes and allow user overwrite
    exercises: settingsLists.exercises,
    creativity: settingsLists.creativity
  }
} as AppContextState;

export const AppContext = React.createContext(defaultAppContext);