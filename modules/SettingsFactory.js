
import React from 'react';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';
import { StyledPicker } from '../components/MiscComponents';
import { settingsConstants } from './Constants';
import { styles } from '../assets/styles/style';

export function DefaultSettings(context) {
    const language = context;

    const languageItems = [
        { label: language.english, value: "en" },
        { label: language.russian, value: "ru" }
    ];
    
    const themeItems = [
        { label: language.dark, value: "dark" },
        { label: language.light, value: "light" }
    ];

    return (
        [
            {
                id: settingsConstants.language,
                title: language.language,
                value: 'en',
                iconName: settingsConstants.language,
                itemContent: (value, onChange) => {
                    return <View>
                        <Text style={[styles.heading2]}>{language.language}</Text>
                        <StyledPicker selectedValue={value}
                            items={languageItems}
                            onValueChange={(newValue, itemIndex) => onChange(newValue)}
                        />
                    </View>
                },
            },
            {
                id: settingsConstants.theme,
                title: language.theme,
                value: 'dark',
                iconName: 'paint-brush',
                itemContent: (value, onChange) => {
                    return <View>
                        <Text style={[styles.heading2]}>{language.theme}</Text>
                        <StyledPicker selectedValue={value}
                            items={themeItems}
                            onValueChange={(newValue, itemIndex) => onChange(newValue)}
                        />
                    </View>
                },
            },
            {
                id: settingsConstants.version,
                title: language.version,
                subTitle: Constants.manifest.version,
                iconName: 'info-circle'
            }
        ])
}