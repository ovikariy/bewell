
import React, { ReactNode } from 'react';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';
import { StyledPicker, StyledPickerItemType } from '../components/MiscComponents';
import { settingsConstants } from './constants';
import { AppContextState } from '../redux/reducerTypes';
import { translations } from './translations';
import { themes } from './themes';
import { Switch } from 'react-native-gesture-handler';

interface SettingsFactoryItemType {
    id: string,
    title: string,
    subTitle?: string,
    value?: string
    iconName?: string,
    readOnly?: boolean,
    itemContent?: (
        value: string | undefined,
        onChange: (newValue: string) => void,
        onCancelChange?: () => void,
        show?: boolean /** if item's row was pressed, to make pressable area wider */
    ) => ReactNode;
}

export function DefaultSettings(context: AppContextState): SettingsFactoryItemType[] {
    const language = context.language;
    const styles = context.styles;

    const languageItems: StyledPickerItemType[] = Object.keys(translations)
        .map(key => ({ label: translations[key].languageLabel, value: key }));

    const themeItems: StyledPickerItemType[] = Object.keys(themes)
        .map(key => ({ label: language[key], value: key }));

    return (
        [
            {
                id: settingsConstants.language,
                title: language.language,
                value: 'en',
                iconName: settingsConstants.language,
                itemContent: (value, onChange, onCancelChange, show) => {
                    return <View style={styles.flex}>
                        <Text style={[styles.heading2]}>{language.language}</Text>
                        <StyledPicker selectedValue={value}
                            show={show}
                            title={language.language}
                            items={languageItems}
                            onCancelChange={onCancelChange}
                            onValueChange={(newValue, itemIndex) => onChange(newValue)}
                        />
                    </View>;
                },
            },
            {
                id: settingsConstants.theme,
                title: language.theme,
                value: 'dark',
                iconName: 'paint-brush',
                itemContent: (value, onChange, onCancelChange, show) => {
                    return <View style={styles.flex}>
                        <Text style={[styles.heading2]}>{language.theme}</Text>
                        <StyledPicker selectedValue={value}
                            show={show}
                            title={language.theme}
                            items={themeItems}
                            onCancelChange={onCancelChange}
                            onValueChange={(newValue, itemIndex) => onChange(newValue)}
                        />
                    </View>;
                },
            },
            {
                id: settingsConstants.hideNoteText,
                title: language.hideNoteText,
                value: 'false',
                iconName: 'eye',
                readOnly: true,
                itemContent: (value, onChange, onCancelChange, show) => {
                    return <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.heading2]}>{language.hideNoteText}</Text>
                            <Text style={[styles.subHeading]}>{language.hideNoteTextSubtitle}</Text>
                        </View>
                        <Switch
                            trackColor={{ true: styles.switchTrack.color, false: styles.switchTrack.color + '50' }}
                            thumbColor={styles.switchThumb.color}
                            ios_backgroundColor={styles.switchTrack.color + '50'}
                            onValueChange={newValue => onChange(newValue ? 'true' : 'false')}
                            value={value === 'true' ? true : false}
                        />
                    </View>;
                },
            },
            {
                id: settingsConstants.version,
                title: language.version,
                subTitle: Constants.manifest.version,
                iconName: 'info-circle',
                readOnly: true
            }
        ]);
}