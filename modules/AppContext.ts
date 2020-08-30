import React from 'react';
import { translations } from './translations';
import { themes } from './themes';
import { getThemeStyles } from '../assets/styles/style';

export interface AppContextInterface {
  language: any, /* TODO: change from any */ 
  theme: any, /* TODO: change from any */ 
  styles: any,/* TODO: change from any */ 
  locale: string 
}

export const defaultAppContext = { 
  language: translations.en, 
  theme: themes.dark, 
  styles: getThemeStyles(themes.dark),
  locale: 'en' 
} as AppContextInterface;

export const AppContext = React.createContext(defaultAppContext);