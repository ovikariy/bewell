import React from 'react';
import { translations } from './translations';
import { themes } from './themes';
import { getThemeStyles } from '../assets/styles/style';
import { AppContextState } from '../redux/reducerTypes';
import { EncryptedSettingsEnum, settingsLists } from './constants';

export const defaultAppContext = {
  language: translations.en,
  theme: themes.dark,
  styles: getThemeStyles(themes.dark),
  locale: 'en',
  otherSettings: {
    hideNoteText: false,
    numAddWidgetButtonsVisible: 5 //TODO: different default on screen sizes and allow user overwrite
  },
  encryptedSettings: {
    [EncryptedSettingsEnum.MOVE]: settingsLists[EncryptedSettingsEnum.MOVE],
    [EncryptedSettingsEnum.CREATE]: settingsLists[EncryptedSettingsEnum.CREATE]
  }
} as AppContextState;

export const AppContext = React.createContext(defaultAppContext);