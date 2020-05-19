import React from 'react';
import { styles } from '../assets/styles/style';
import { Text, TouchableOpacity, View } from 'react-native';

export const Tags = (props) => {
    return (
        <View style={styles.tagsContainer}>
            <Text style={[styles.bodyText, styles.spacedOut]}>{props.title}</Text>
            <View style={[{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }]}>
                {props.items.map((tag, index) => <Tag key={index} value={tag} onTagPress={(value) => props.onPress(value)} />)}
            </View>
        </View>
    )
}

export const Tag = (props) => {
    return (
        /* when tag is pressed, update its date for ordering in the recently used tags */
        <TouchableOpacity onPress={() => props.onTagPress({ ...props.value, date: new Date().toISOString() })} >
            <Text {...props} style={[styles.bodyText, styles.brightColor, styles.strongText, styles.spacedOut, props.style]}>
                {props.value.id}
            </Text>
        </TouchableOpacity>
    )
}

export default Tags;
