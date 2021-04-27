import * as ActionTypes from './actionTypes';
import { settingsConstants } from '../modules/constants';
import { translations } from '../modules/translations';
import { themes } from '../modules/themes';
import { getThemeStyles } from '../assets/styles/style';
import { defaultAppContext } from '../modules/appContext';
import { AppContextAction, AppContextState } from './reducerTypes';
import { convertToNumber } from '../modules/utils';

export const APPCONTEXT = (state: AppContextState = defaultAppContext, action: AppContextAction) => {
    switch (action.type) {
        case ActionTypes.SETTINGS_CHANGED: {
            if (!action.payload.settings || !(action.payload.settings.length > 0))
                return state;

            const newState = { ...state };
            let hasChanges = false;

            action.payload.settings.forEach(setting => {
                if (!setting.value)
                    return;
                else
                    hasChanges = true;

                if (setting.id === settingsConstants.language) {
                    newState.language = translations[setting.value];
                    newState.locale = setting.value;
                }
                if (setting.id === settingsConstants.theme) {
                    newState.theme = themes[setting.value];
                    newState.styles = getThemeStyles(newState.theme);
                }
                if (setting.id === settingsConstants.hideNoteText)
                    newState.otherSettings.hideNoteText = (setting.value === 'true');
                //TODO: implement UI for this on the settings screen, currently it's only hardcoded
                if (setting.id === settingsConstants.numAddWidgetButtonsVisible)
                    newState.otherSettings.numAddWidgetButtonsVisible = convertToNumber(setting.value);

            });
            if (hasChanges)
                return newState;
            else
                return state;
        }
        default:
            return state;
    }
};