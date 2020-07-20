import React from 'react';
import { Alert, View } from 'react-native';
import { IconButton } from './MiscComponents';
import { getStorageKeyFromDate } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { WidgetFactory } from '../modules/WidgetFactory';

export const Toolbar = (props) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return (
        <View style={[styles.toolbarContainer, styles.centered, props.style]}>{props.children}</View>
    )
}

export const FloatingToolbar = (props) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

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
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return <IconButton iconType={props.iconType || 'font-awesome'} 
    containerStyle={styles.toolbarButtonContainer} 
    iconStyle={props.iconStyle || [styles.iconPrimary, { color: styles.brightColor.color}]}
    titleStyle={props.titleStyle || [styles.toolbarButtonText, { color: styles.brightColor.color}]}
    {...props} />
}

export const ViewHistoryButton = (props) => {
    const context = React.useContext(AppContext);
    const widgetFactory = WidgetFactory(context);
    const widgetConfig = widgetFactory[props.item.type].config;
    const historyTitle = widgetConfig.historyTitle ? widgetConfig.historyTitle : widgetConfig.widgetTitle;

    function onPress() {
        const item = props.item;
        if (!item) {
            alert(context.language.selectItemFirst);
            return;
        }
        props.navigation.navigate('ItemHistory', { 'itemType': props.item.type, 'title': historyTitle }); 
    }

    return <ToolbarButton iconName='history' onPress={() => { onPress() }} />
}

export const DeleteButton = (props) => {
    const context = React.useContext(AppContext);
    const language = context.language;

    function onPress() {
        Alert.alert(
            language.deleteThisItem,
            language.areYouSureDeleteThisItem,
            [
                {
                    text: language.cancel
                },
                {
                    text: language.ok,
                    onPress: () => remove()
                }
            ],
            { cancelable: false }
        );
    }

    function remove() {
        const item = props.item;
        if (!item) {
            alert(language.selectItemFirst);
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