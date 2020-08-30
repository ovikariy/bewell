import React, { Component } from 'react';
import { ClearTextArea, IconForButton, TimePicker } from './MiscComponents';
import { AppContext } from '../modules/AppContext';
import { WidgetBase, WidgetComponentPropsBase } from '../modules/WidgetFactory';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/helpers';

export interface NoteComponentWidgetType extends WidgetBase {
  note?: string
}

export interface NoteComponentProps extends WidgetComponentPropsBase {
  value: NoteComponentWidgetType;
  onChange: (newValue: NoteComponentWidgetType) => void
}

export const NoteComponent = (props: NoteComponentProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  return <ClearTextArea
    numberOfLines={1}
    placeholder={language.whatsOnYourMind}
    value={props.value ? props.value.note : undefined}
    onChangeText={(note) => { props.onChange({ ...props.value, note }) }}
  />
}

interface NoteHistoryComponentProps {
  item: NoteComponentWidgetType;
  isSelectedItem: boolean;
}
export const NoteHistoryComponent = (props: NoteHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (<View style={styles.row}>
    <View style={[styles.flex]}>
      <Text style={props.isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
        {friendlyTime(props.item.date)}</Text>
      <Text style={props.isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
        {props.item.note + 'hello'}</Text>
    </View>
  </View>)
}