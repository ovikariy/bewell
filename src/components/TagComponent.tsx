import React from 'react';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { WidgetBase } from '../modules/types';
import { StyleProp, View, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { sizes } from '../assets/styles/style';
import { IconButton } from './MiscComponents';
import { Text } from 'react-native-elements';

export interface TagsComponentWidgetType extends WidgetBase {
  tags?: string;
}

export interface TagsComponentProps extends WidgetComponentPropsBase {
  value: TagsComponentWidgetType;
  allTags: string[],
  multiSelect?: boolean;
  onChange?: (newValue: TagsComponentWidgetType) => void;
  containerStyle?: StyleProp<ViewStyle>
}

export const TagsComponent = (props: TagsComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  const selectedTags = (props.value?.tags || '').split(',');

  const tags = props.allTags?.map((tag) => {
    const selectedIndex = selectedTags.indexOf(tag);
    return <Tag key={tag} tag={language[tag] ? language[tag] : tag}
      isSelected={selectedIndex >= 0}
      onPress={!props.onChange ? undefined : () => onPress(tag, selectedIndex)}
    />;
  });

  return (
    <View style={[{paddingTop: sizes[20]}, props.containerStyle]}>
      <Text style={[styles.bodyText, {paddingLeft: sizes[5]}]}>{language.tapToSelect}:</Text>
      <Animatable.View animation="fadeIn" duration={1000} style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: sizes[5] }}>
        {tags}
      </Animatable.View>
    </View>
  );

  function onPress(tag: string, selectedIndex: number) {
    /** if not multi select then need to deselect all other */
    if (selectedIndex >= 0)
      selectedTags.splice(selectedIndex, 1); /** deselect */
    else {
      if (props.multiSelect)
        selectedTags.push(tag);
      else {
        selectedTags.length = 0;
        selectedTags.push(tag);
      }
    }
    if (props.onChange)
      props.onChange({ ...props.value, tags: selectedTags.join(',') });
  }
};

export const Tag = (props: { tag: string, isSelected: boolean, onPress?: () => void }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <IconButton title={props.tag + ''}
      containerStyle={props.isSelected ? styles.buttonTertiary : styles.buttonPrimary}
      titleStyle={{ ...styles.toolbarButtonText, ...styles.bodyText, color: props.isSelected ? styles.brightColor.color : styles.bodyText.color }}
      onPress={!props.onPress ? undefined : (() => {
        if (props.onPress) props.onPress();
      })}
    />
  );
};

interface TagHistoryComponentProps {
  item: TagsComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
  iconType?: string;
  iconName?: string;
}
export const TagHistoryComponent = (props: TagHistoryComponentProps) => {
  return (
    <View style={{ marginTop: sizes[10] }}>
      <TagsComponent value={props.item} {...props} selectedDate={new Date(props.item.date)} />
    </View>
  );
};

export const TagCalendarComponent = (props: TagHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <IconButton iconType={props.iconType || 'material-community'} iconName={props.iconName || 'star'} title={props.item.tags + ''}
    containerStyle={styles.toolbarButtonContainer}
    iconStyle={{ ...styles.iconPrimary, color: styles.brightColor.color }}
    titleStyle={{
      ...styles.toolbarButtonText, ...styles.bodyText, fontSize: sizes[16],
      position: 'absolute', paddingTop: sizes[5], color: styles.highlightColor.color
    }}
  />;
};