interface ThemePropertyStyleType {
    foreground: string;
    foreground2: string;
    foreground3: string;
    colorful1: string;
    colorful2: string;
    background: string;
    background2: string;
    background3: string;
    statusBarText: string;
    transparent: string;
}

export interface ThemePropertyType {
    id: string,
    label: string;
    colors: ThemePropertyStyleType;
}
export interface ThemeType {
    [key: string]: ThemePropertyType
}

export const themeIDs = { dark: 'dark', light: 'light' };

export const themes: ThemeType = {
    [themeIDs.dark]: {
        id: themeIDs.dark,
        label: 'Dark',
        colors: {
            /* don't use short notation for colors because may need to append opacity e.g. tintColor + '70' */
            foreground: '#FFFFFF', /* snow white */
            foreground2: '#FFFFFF', /* snow white, always light e.g. for toolbar with color background */
            foreground3: '#125973', /* onyx black, always dark e.g. for password field with white background */

            colorful1: '#87BCBF', /* sage light aqua */
            colorful2: '#D97D54', /* rust burnt orange */

            background: '#324755', /* drab dark grey */
            background2: '#6E8CA0', /* slate medium grey, floating toolbar etc */
            background3: '#6E8CA0', /* slate medium grey, widget selected etc */

            statusBarText: 'light',
            transparent: 'transparent'
        }
    },
    [themeIDs.light]: {
        id: themeIDs.light,
        label: 'Light',
        colors: {
            /* don't use short notation for colors because may need to append opacity e.g. tintColor + '70' */
            foreground: '#125973',  /* dark aqua */
            foreground2: '#FFFFFF', /* snow white, always light e.g. for toolbar with color background */
            foreground3: '#125973', /* dark aqua, always dark e.g. for password field with white background */

            colorful1: '#25949A', /* sage dark aqua */
            colorful2: '#D97D54', /* rust burnt orange */

            background: '#FFFFFF', /* snow white */
            background2: '#6E8CA0', /* slate medium grey, floating toolbar etc */
            background3: '#125973', /* light orange, widget selected etc */

            statusBarText: 'dark',
            transparent: 'transparent'
        }
    }
};