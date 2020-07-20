import React from 'react';
import { translations } from '../modules/translations';
import { themes } from '../modules/themes';
import { getThemeStyles } from '../assets/styles/style';

export const defaultAppContext = { 
  language: translations.en, 
  theme: themes.dark, 
  styles: getThemeStyles(themes.dark),
  locale: 'en' 
};

export const AppContext = React.createContext(defaultAppContext);