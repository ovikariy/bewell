import React from 'react';
import { Alert, View, Text } from 'react-native';
import { text } from '../modules/Constants';
import { styles } from '../assets/styles/style';
import { IconButton } from './MiscComponents';
import { getStorageKeyFromDate } from '../modules/helpers';

export const Toolbar = (props) => {
    return (
        <View style={[styles.toolbarContainer, styles.centered, props.style]}>{props.children}</View>
    )
}

export const FloatingToolbar = (props) => {
    if (props.isVisible)
        return (
            <Toolbar style={[styles.floatingContainer, props.style]}>
                {props.children}
            </Toolbar>
        )
    else
        return (
            <Toolbar style={[styles.floatingContainer]} />
        )
}

export const ToolbarButton = (props) => {
    return <IconButton iconType={props.iconType || 'font-awesome'} containerStyle={styles.toolbarButtonContainer} {...props} />
}

export const ViewHistoryButton = (props) => {
    function onPress() {
        const item = props.item;
        if (!item) {
            alert(text.listItems.SelectItemFirst);
            return;
        }
        props.navigation.navigate('ItemHistory', { 'itemType': props.item.type });
    }

    return <ToolbarButton iconName='history' onPress={() => { onPress() }} />
}

export const DeleteButton = (props) => {
    function onPress() {
        Alert.alert(
            text.listItems.DeleteThisItem,
            text.listItems.AreYouSureDeleteThisItem,
            [
                {
                    text: text.general.Cancel,
                    style: text.general.Cancel
                },
                {
                    text: text.general.Ok,
                    onPress: () => remove()
                }
            ],
            { cancelable: false }
        );
    }

    function remove() {
        const item = props.item;
        if (!item) {
            alert(text.listItems.SelectItemFirst);
            return;
        }
        props.onDelete(item);
    }

    return <ToolbarButton iconName='trash-o' onPress={() => { onPress() }} />
}

export const DeleteWidgetItemButton = (props) => {
    function onDelete(item) {
        const storeKey = getStorageKeyFromDate(item.date);
        props.onDelete(storeKey, item.id);
    }
    return <DeleteButton item={props.item} onDelete={(item) => { onDelete(item) }} />
}