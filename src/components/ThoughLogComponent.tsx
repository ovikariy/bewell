import React, { useState } from 'react';
import { ClearTextArea, IconButton } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase } from '../modules/widgetFactory';
import { WidgetBase } from '../modules/types';
import { Text, View } from 'react-native';
import { friendlyTime, isEmptyWidgetItem } from '../modules/utils';
import { sizes } from '../assets/styles/style';

export interface ThoughtLogComponentWidgetType extends WidgetBase {
  event?: string
  thought?: string
  consequence?: string //emotion and behavior
  altresp?: string //alternate response
}

export interface ThoughtLogComponentProps extends WidgetComponentPropsBase {
  value: ThoughtLogComponentWidgetType;
  onChange?: (newValue: ThoughtLogComponentWidgetType) => void
}

const ThoughtLog = (props: ThoughtLogComponentProps & { readonly?: boolean }) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;

  function getTextArea(label: string, value?: string, readonly?: any, onChange?: (newValue: string) => void) {
    return <ClearTextArea
      label={label}
      editable={!readonly}
      labelStyle={{ color: styles.titleText.color, paddingBottom: sizes[5] }}
      containerStyle={{ marginBottom: sizes[16] }}
      inputContainerStyle={[{ borderBottomWidth: 0 }, !readonly && { backgroundColor: styles.titleText.color + '10', padding: sizes[6] }]}
      value={value}
      onChangeText={(newValue) => onChange ? onChange(newValue) : {}}
      autoFocus={false}
    />;
  }
  return <View>
    {getTextArea(language.event, props.value ? props.value.event : undefined, props.readonly, (event) => props.onChange ? props.onChange({ ...props.value, event }) : {})}
    {getTextArea(language.thought, props.value ? props.value.thought : undefined, props.readonly, (thought) => props.onChange ? props.onChange({ ...props.value, thought }) : {})}
    {getTextArea(language.consequence, props.value ? props.value.consequence : undefined, props.readonly, (consequence) => props.onChange ? props.onChange({ ...props.value, consequence }) : {})}
    {getTextArea(language.alternateResponse, props.value ? props.value.altresp : undefined, props.readonly, (altresp) => props.onChange ? props.onChange({ ...props.value, altresp }) : {})}
  </View>;
};

export const ThoughtLogComponent = (props: ThoughtLogComponentProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;

  const shouldHideText = context.otherSettings.hideNoteText;
  if (!shouldHideText)
    return <ThoughtLog {...props} />;

  /* if user chose to hideNoteText in settings then need to hide text by default */

  const isNew = !props.value || isEmptyWidgetItem(props.value); /** if just adding a new note, text should be visible by default */ //TODO: test this
  const [showText, setShowText] = useState(isNew); /** toggle content visibility on the home screen for added security */

  return <View>
    <IconButton iconType={'font-awesome'} title={showText ? language.hideText : language.showText}
      containerStyle={[styles.toolbarButtonContainer, styles.spaced, { flexDirection: 'row', alignSelf: 'flex-start', marginBottom: sizes[10] }]}
      iconStyle={{ ...styles.iconPrimary, ...{ color: styles.bodyText.color, marginHorizontal: sizes[10] } }}
      titleStyle={{ ...styles.toolbarButtonText, ...styles.bodyText }}
      iconName={showText ? 'eye-slash' : 'eye'} onPress={() => { setShowText(!showText); }} />
    {showText && <ThoughtLog {...props} />}
  </View>;
};

interface ThoughtLogHistoryComponentProps {
  item: ThoughtLogComponentWidgetType;
  isSelectedItem: boolean;
}
export const ThoughtLogHistoryComponent = (props: ThoughtLogHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

   return <View style={[styles.flex]}>
      <Text style={[styles.bodyTextLarge, {marginVertical: sizes[15]}]}>
        {friendlyTime(props.item.date)}</Text>
      <ThoughtLog value={props.item} selectedDate={new Date()} config={null} readonly={true} />
  </View>;
};