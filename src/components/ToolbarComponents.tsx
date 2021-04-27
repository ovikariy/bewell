import React, { PropsWithChildren, ReactNode } from 'react';
import { Alert, View, ViewProps } from 'react-native';
import { IconButton, ButtonPropsInterface } from './MiscComponents';
import { getStorageKeyFromDate } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { WidgetConfig } from '../modules/widgetFactory';
import { WidgetBase } from '../modules/types';

export const Toolbar = (props: PropsWithChildren<ViewProps>) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return (
        <View style={[styles.toolbarContainer, styles.centered, props.style]}>{props.children}</View>
    );
};

export const FloatingToolbar = (props: PropsWithChildren<ViewProps> & { isVisible?: boolean }) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    if (props.isVisible) {
return (
            <Toolbar style={[styles.floatingContainer, props.style]}>
                {props.children}
            </Toolbar>
        );
}
    else {
return (
            <Toolbar style={[styles.floatingContainer]} />
        );
}
};

export const ToolbarButton = (props: ButtonPropsInterface) => {
    const context = React.useContext(AppContext);
    const styles = context.styles;

    return <IconButton iconType={props.iconType || 'font-awesome'}
        containerStyle={[styles.toolbarButtonContainer, props.containerStyle]}
        iconStyle={props.iconStyle || { ...styles.iconPrimary, ...{ color: styles.brightColor.color } }}
        titleStyle={props.titleStyle || { ...styles.toolbarButtonText, ...{ color: styles.brightColor.color } }}
        {...props} />;
};

export const ViewHistoryButton = (props: { item?: WidgetBase, itemConfig?: WidgetConfig, navigation: any }) => {
    const context = React.useContext(AppContext);

    function onPress() {
        if (!props.item || !props.itemConfig) {
            alert(context.language.selectItemFirst);
            return;
        }
        const historyTitle = props.itemConfig.historyTitle ? props.itemConfig.historyTitle : props.itemConfig.widgetTitle;
        props.navigation.navigate('ItemHistory', { itemType: props.item.type, title: historyTitle });
    }

    return <ToolbarButton iconName='history' onPress={() => { onPress(); }} />;
};

export const DeleteButton = (props: { item?: any, onDelete: (item: any) => void }) => {
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

    return <ToolbarButton iconName='trash-o' onPress={() => { onPress(); }} />;
};

export const DeleteWidgetItemButton = (props: { item?: any, onDelete: (storeKey: string, item: any) => void }) => {
    function onDelete(item: any) {
        const storeKey = getStorageKeyFromDate(item.date);
        props.onDelete(storeKey, item);
    }
    return <DeleteButton item={props.item} onDelete={(item) => { onDelete(item); }} />;
};