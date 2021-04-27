import React, { useState } from 'react';
import { WheelPicker, WheelPickerReadonly, IconButton } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { sizes } from '../assets/styles/style';
import { Tag, TagsComponent, TagsComponentWidgetType } from './TagComponent';
import { settingsConstants, settingsLists } from '../modules/constants';

export interface ActivityComponentWidgetType extends TagsComponentWidgetType {
  duration?: number;
  distance?: number
}

export interface ActivityComponentProps extends WidgetComponentPropsBase {
  value: ActivityComponentWidgetType;
  activities?: string[],
  showDuration?: boolean,
  showDistance?: boolean,
  onChange?: (newValue: ActivityComponentWidgetType) => void
}

export const ActivityComponent = (props: ActivityComponentProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;

  //TODO: allow user to enter their own (I'm guessing in their language so we can use that first then append translated values)

  const isEmpty = !props.value || !props.value.tags; /** if just adding a new item or changing selection, tags should be visible by default */
  const [isEditMode, setIsEditMode] = useState(isEmpty);

  return <View style={{ padding: sizes[5], paddingVertical: sizes[10] }}>
    {!isEmpty && renderDisplaySection()}
    {(isEditMode && props.onChange) && renderEditableSection()}
  </View>;

  function renderDisplaySection() {
    return <Text onPress={(e) => { setIsEditMode(!isEditMode); }}> {/* NOTE: <Text> component here is a cludge because it accepts child nodes AND has onPress event AND doesn't bubble up the event to the widget row touchable */}
      {
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Tag tag={props.value.tags + ''} isSelected={true} onPress={() => { setIsEditMode(!isEditMode); }} />
          <View style={{ marginLeft: sizes[20], justifyContent: 'center' }}>
            {(props.value?.duration > 0) && <WheelPickerReadonly textLeft={language.Duration + ':'} textRight={language.Minutes.toLowerCase()} value={props.value.duration} icon={{ name: 'clock-outline' }} isSelected={props.isSelected} />}
            {(props.value?.distance > 0) && <WheelPickerReadonly textLeft={language.Distance + ':'} textRight={language.Kilometers.toLowerCase()} value={props.value.distance} icon={{ name: 'map-marker-distance' }} isSelected={props.isSelected} />}
          </View>
        </View>
      }
    </Text>;
  }

  function renderEditableSection() {
    return <View>
      <TagsComponent allTags={props.activities || []} {...props} containerStyle={{ marginBottom: sizes[20] }} />
      {props.showDuration === true &&
        <WheelPicker title={language.Minutes} textLeft={language.Duration + '?'} textRight={language.Minutes.toLocaleLowerCase()} icon={{ name: 'clock-outline' }}
          containerStyle={{ marginBottom: sizes[5] }}
          data={settingsLists.durationPickerItems} value={props.value?.duration} firstValueIsEmpty={true}
          onChange={(duration) => { if (props.onChange) props.onChange({ ...props.value, duration }); }} />}
      {props.showDistance === true &&
        <WheelPicker title={language.Kilometers} textLeft={language.Distance + '?'} textRight={language.Kilometers.toLocaleLowerCase()} icon={{ name: 'map-marker-distance' }}
          data={settingsLists.distancePickerItems} value={props.value?.distance} firstValueIsEmpty={true}
          onChange={(distance) => { if (props.onChange) props.onChange({ ...props.value, distance }); }} />}
    </View>;
  }
};

export interface ActivityHistoryComponentProps {
  item: ActivityComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const ActivityHistoryComponent = (props: ActivityHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (<View style={styles.row}>
    <View style={[styles.flex]}>
      <Text style={[styles.bodyText, { color: styles.titleText.color }]}>
        {friendlyTime(props.item.date)}</Text>
      <ActivityComponent value={props.item} config={props.config} selectedDate={new Date(props.item.date)} isSelected={props.isSelectedItem} />
    </View>
  </View>);
};

export const ActivityCalendarComponent = (props: ActivityHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <IconButton iconName='check-circle' iconType='material-community'
    containerStyle={styles.toolbarButtonContainer}
    iconStyle={{ ...styles.iconPrimary }}
  />;
};