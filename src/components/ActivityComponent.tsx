import React, { useState } from 'react';
import { ButtonTertiary, WheelPicker, WheelPickerReadonly, IconButton } from './MiscComponents';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase, WidgetConfig } from '../modules/widgetFactory';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { sizes } from '../assets/styles/style';
import { TagsComponent, TagsComponentWidgetType } from './TagComponent';
import { settingsConstants } from '../modules/constants';

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

  //TODO: translations and allow user to enter their own (I'm guessing in their language so we can use that first then append translated values)

  const isEmpty = !props.value || !props.value.tags; /** if just adding a new item or changing selection, tags should be visible by default */
  const [isEditMode, setIsEditMode] = useState(isEmpty);

  return <View style={{ padding: sizes[5], paddingVertical: sizes[10] }}>
    {!isEmpty && renderDisplaySection()}
    {(isEditMode && props.onChange) && renderEditableSection()}
  </View>;

  //TODO: translations
  function renderDisplaySection() {
    return <View style={{ flex: 1, flexDirection: 'row' }}>
      <ButtonTertiary title={props.value.tags || 'Make a selection'}
        onPress={(e) => { setIsEditMode(!isEditMode); }} />
      <View style={{ marginLeft: sizes[20], justifyContent: 'center' }}>
        {(props.value?.duration > 0) && <WheelPickerReadonly textLeft='Duration:' textRight='minutes' value={props.value.duration} icon={{ name: 'clock-outline' }} isSelected={props.isSelected} />}
        {(props.value?.distance > 0) && <WheelPickerReadonly textLeft='Distance:' textRight='km' value={props.value.distance} icon={{ name: 'map-marker-distance' }} isSelected={props.isSelected} />}
      </View>
    </View>;
  }

  //TODO: translations
  function renderEditableSection() {
    return <View>
      <TagsComponent allTags={props.activities || []} {...props} containerStyle={{ marginBottom: sizes[20] }} />
      {props.showDuration === true &&
        <WheelPicker title='Minutes' textLeft='Duration?' textRight='Minutes' icon={{ name: 'clock-outline' }}
          containerStyle={{ marginBottom: sizes[5] }}
          data={settingsConstants.durationPickerItems} value={props.value?.duration} firstValueIsEmpty={true}
          onChange={(duration) => { if (props.onChange) props.onChange({ ...props.value, duration }); }} />}
      {props.showDistance === true && <WheelPicker title='Kilometers' textLeft='Distance?' textRight='km' icon={{ name: 'map-marker-distance' }}
        data={settingsConstants.distancePickerItems} value={props.value?.distance} firstValueIsEmpty={true}
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
      <Text style={[styles.bodyText,{color: styles.titleText.color}]}>
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