import * as ActionTypes from './ActionTypes';
import { settingsConstants } from '../modules/Constants';
import { translations } from '../modules/translations';
import { themes } from '../modules/themes';
import { getThemeStyles } from '../assets/styles/style';
import { AppContextInterface, defaultAppContext } from '../modules/AppContext';
import { SettingType } from '../modules/types';
import { AppContextReducerActions, AppContextReducerState } from './reducerTypes';

/*
    errCodes and successCodes are used for looking up translation of messages
    the codes without a matching translation will be shown as is
    errCodes and successCodes can be an array or a string if just one code
    e.g. ['InvalidCredentials', 'A1001']  will be shown as 'Invalid credentials, please try again A1001'
    e.g. ['InvalidCredentials'] or just a string 'InvalidCredentials' will be shown as 'Invalid credentials, please try again '
*/

export const APPCONTEXT = (state: AppContextReducerState = {
    context: defaultAppContext
}, action: AppContextReducerActions) => {
    switch (action.type) {
        case ActionTypes.SETTINGS_CHANGED: {
            if (!action.payload.settings || !(action.payload.settings.length > 0))
                return state;

            const language = action.payload.settings.find((setting) => setting.id == settingsConstants.language);
            const theme = action.payload.settings.find((setting) => setting.id == settingsConstants.theme);

            if (!language && !theme)
                return state;

            const context = { ...state.context };
            if (language && language.value) {
                context.language = translations[language.value];
                context.locale = language.value;
            }
            if (theme && theme.value) {
                context.theme = themes[theme.value];
                context.styles = getThemeStyles(context.theme);
            }

            return { ...state, context };
        }
        default:
            return state;
    }
}