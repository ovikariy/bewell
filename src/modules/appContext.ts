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
    hideNoteText: false
  },
  encryptedSettings: {
    [EncryptedSettingsEnum.MOVE]: settingsLists[EncryptedSettingsEnum.MOVE],
    [EncryptedSettingsEnum.CREATE]: settingsLists[EncryptedSettingsEnum.CREATE],
    [EncryptedSettingsEnum.MEDICINE]: settingsLists[EncryptedSettingsEnum.MEDICINE]
  }
} as AppContextState;

export const AppContext = React.createContext(defaultAppContext);