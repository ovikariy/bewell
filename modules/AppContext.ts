import React from 'react';
import { translations, TranslationKeys } from './translations';
import { ThemePropertyType, themes } from './themes';
import { getThemeStyles } from '../assets/styles/style';

export interface AppContextInterface {
  language: TranslationKeys,
  theme: ThemePropertyType,
  styles: any,
  locale: string 
}

export const defaultAppContext = { 
  language: translations.en, 
  theme: themes.dark, 
  styles: getThemeStyles(themes.dark),
  locale: 'en' 
} as AppContextInterface;

export const AppContext = React.createContext(defaultAppContext);