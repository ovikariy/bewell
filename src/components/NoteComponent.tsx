import React, { useState } from 'react';
import { ClearTextArea, IconButton } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import { WidgetBase, WidgetComponentPropsBase } from '../modules/widgetFactory';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { sizes } from '../assets/styles/style';

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
  const styles = context.styles;

  const shouldHideText = context.otherSettings.hideNoteText;
  if (!shouldHideText)
    return getTextArea();

  /* if user chose to hideNoteText in settings then need to hide text by default */

  const isNew = !props.value || !props.value.note; /** if just adding a new note, text should be visible by default */
  const [showText, setShowText] = useState(isNew); /** toggle content visibility on the home screen for added security */

  return <View>
    <IconButton iconType={'font-awesome'} title={showText ? language.hideText : language.showText}
      containerStyle={[styles.toolbarButtonContainer, styles.spaced, { flexDirection: 'row', alignSelf: 'flex-start', marginBottom: sizes[10] }]}
      iconStyle={{ ...styles.iconPrimary, ...{ color: styles.bodyText.color, marginHorizontal: sizes[10] } }}
      titleStyle={{ ...styles.toolbarButtonText, ...styles.bodyText }}
      iconName={showText ? 'eye-slash' : 'eye'} onPress={() => { setShowText(!showText); }} />
    {showText && getTextArea()}
  </View>;

  function getTextArea() {
    return <ClearTextArea
      numberOfLines={1}
      placeholder={language.whatsOnYourMind}
      value={props.value ? props.value.note : undefined}
      onChangeText={(note) => { props.onChange({ ...props.value, note }); }}
    />;
  }
};

interface NoteHistoryComponentProps {
  item: NoteComponentWidgetType;
  isSelectedItem: boolean;
}
export const NoteHistoryComponent = (props: NoteHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (<View style={styles.row}>
    <View style={[styles.flex]}>
      <Text style={styles.bodyText}>
        {friendlyTime(props.item.date)}</Text>
      <Text style={[styles.bodyText, {color: styles.titleText.color}]}>
        {props.item.note}</Text>
    </View>
  </View>);
};