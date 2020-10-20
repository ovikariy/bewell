import * as ActionTypes from './ActionTypes';
import { settingsConstants } from '../modules/Constants';
import { translations } from '../modules/translations';
import { themes } from '../modules/themes';
import { getThemeStyles } from '../assets/styles/style';
import { defaultAppContext } from '../modules/AppContext';
import { AppContextAction, AppContextState } from './reducerTypes';

export const APPCONTEXT = (state: AppContextState = {
    context: defaultAppContext
}, action: AppContextAction) => {
    switch (action.type) {
        case ActionTypes.SETTINGS_CHANGED: {
            if (!action.payload.settings || !(action.payload.settings.length > 0))
                return state;

            const language = action.payload.settings.find((setting) => setting.id === settingsConstants.language);
            const theme = action.payload.settings.find((setting) => setting.id === settingsConstants.theme);

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
};