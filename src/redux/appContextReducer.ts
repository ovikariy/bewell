import * as ActionTypes from './actionTypes';
import { settingsConstants } from '../modules/constants';
import { translations } from '../modules/translations';
import { themes } from '../modules/themes';
import { getThemeStyles } from '../assets/styles/style';
import { defaultAppContext } from '../modules/appContext';
import { AppContextAction, AppContextState } from './reducerTypes';

export const APPCONTEXT = (state: AppContextState = defaultAppContext, action: AppContextAction) => {
    switch (action.type) {
        case ActionTypes.SETTINGS_CHANGED: {
            if (!action.payload.settings || !(action.payload.settings.length > 0))
                return state;

            const language = action.payload.settings.find((setting) => setting.id === settingsConstants.language);
            const theme = action.payload.settings.find((setting) => setting.id === settingsConstants.theme);
            const hideNoteText = action.payload.settings.find((setting) => setting.id === settingsConstants.hideNoteText);

            if (!language && !theme && !hideNoteText)
                return state;

            const context = { ...state };
            if (language && language.value) {
                context.language = translations[language.value];
                context.locale = language.value;
            }
            if (theme && theme.value) {
                context.theme = themes[theme.value];
                context.styles = getThemeStyles(context.theme);
            }
            if (hideNoteText && hideNoteText.value)
                context.otherSettings.hideNoteText = (hideNoteText.value === 'true');

            return context;
        }
        default:
            return state;
    }
};