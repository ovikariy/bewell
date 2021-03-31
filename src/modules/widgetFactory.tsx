import React, { ReactNode } from 'react';
import { ItemTypes, settingsConstants } from './constants';
import { AppContextState } from '../redux/reducerTypes';
import { NoteComponent, NoteComponentProps, NoteComponentWidgetType, NoteHistoryComponent } from '../components/NoteComponent';
import { MoodCalendarComponent, MoodComponent, MoodComponentProps, MoodComponentWidgetType, MoodHistoryComponent } from '../components/MoodComponent';
import { SleepComponent, SleepComponentProps, SleepComponentWidgetType, SleepHistoryComponent, SleepCalendarComponent } from '../components/SleepComponent';
import { ImagePickerComponent, ImagePickerComponentProps, ImagePickerWidgetType, ImagePickerHistoryComponent } from '../components/ImagePickerComponent';
import { StyleProp, ViewStyle } from 'react-native';
import { CustomIconType } from '../components/CustomIconRating';
import { ItemBase } from './types';
import { sizes } from '../assets/styles/style';
import { RatingCalendarComponent, RatingComponent, RatingComponentProps, RatingComponentWidgetType, RatingHistoryComponent } from '../components/RatingComponent';
import { ActivityCalendarComponent, ActivityComponent, ActivityComponentProps, ActivityComponentWidgetType, ActivityHistoryComponent } from '../components/ActivityComponent';

export function CreateWidgetFactory(context: AppContextState) {
  const language = context.language;
  const styles = context.styles;

  const widgetFactory: WidgetFactory = {
    [ItemTypes.NOTE]:
      {
        config: {
          widgetTitle: language.note,
          historyTitle: language.notes,
          itemTypeName: ItemTypes.NOTE,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: language.note, name: 'pencil-square-o', type: 'font-awesome' } as WidgetAddIconConfig,
          style: {} as ViewStyle
        } as WidgetConfig,
        renderWidgetItem: (props: NoteComponentProps, config: WidgetConfig) => {
          return <NoteComponent  {...props} config={config} />;
        },
        renderHistoryItem: (item: NoteComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <NoteHistoryComponent item={item} isSelectedItem={isSelectedItem} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.MOOD]:
      {
        config: {
          widgetTitle: language.mood,
          historyTitle: language.moods,
          itemTypeName: ItemTypes.MOOD,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          isHorizontalHistoryRow: true, /* on the history screen, show all items for the day in one row */
          addIcon: { text: language.mood, name: 'smile-o', type: 'font-awesome' } as WidgetAddIconConfig,
          style: {} as ViewStyle,
          icons: [
            { name: language.happy, icon: 'mood-happy', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#ff9a55' } } as CustomIconType,
            { name: language.soso, icon: 'mood-neutral', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#009898' } } as CustomIconType,
            { name: language.couldBeBetter, icon: 'mood-sad', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#517fa4' } } as CustomIconType
          ]
        },
        renderWidgetItem: (props: MoodComponentProps, config: WidgetConfig) => {
          return <MoodComponent  {...props} config={config} />;
        },
        renderHistoryItem: (item: MoodComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <MoodHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: MoodComponentWidgetType, config: WidgetConfig) => {
          return <MoodCalendarComponent item={item} isSelectedItem={false} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.SLEEP]:
      {
        config: {
          widgetTitle: language.sleep,
          historyTitle: language.sleeps,
          itemTypeName: ItemTypes.SLEEP,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: language.sleep, name: 'moon-o', type: 'font-awesome' } as WidgetAddIconConfig,
          style: {} as ViewStyle,
          icons: [
            { name: language.restful, icon: 'sleep-happy', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#ff9a55' } } as CustomIconType,
            { name: language.interrupted, icon: 'sleep-neutral', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#009898' } } as CustomIconType,
            { name: language.poor, icon: 'sleep-sad', iconStyle: styles.brightColor, backgroundStyle: { backgroundColor: '#517fa4' } } as CustomIconType
          ]
        } as WidgetConfig,
        renderWidgetItem: (props: SleepComponentProps, config: WidgetConfig) => {
          return <SleepComponent {...props} config={config} />;
        },
        renderHistoryItem: (item: SleepComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <SleepHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: SleepComponentWidgetType, config: WidgetConfig) => {
          return <SleepCalendarComponent item={item} isSelectedItem={false} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.IMAGE]:
      {
        config: {
          widgetTitle: language.image,
          hideTitleInHeader: true,
          historyTitle: language.images,
          itemTypeName: ItemTypes.IMAGE,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: language.image, name: 'picture-o', type: 'font-awesome' } as WidgetAddIconConfig,
          style: { paddingVertical: 0, paddingTop: sizes[20] } as ViewStyle
        } as WidgetConfig,
        renderWidgetItem: (props: ImagePickerComponentProps, config: WidgetConfig) => {
          return <ImagePickerComponent  {...props} config={config} readonly={false} />;
        },
        renderHistoryItem: (item: ImagePickerWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <ImagePickerHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.MOVE]:
      {
        config: {
          widgetTitle: 'Movement', //TODO: language.waterIntake,
          historyTitle: 'Movement', //TODO: language.waterIntake,
          itemTypeName: ItemTypes.MOVE,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: 'Move', name: 'walk', type: 'material-community' } as WidgetAddIconConfig,
          style: {} as ViewStyle
        },
        renderWidgetItem: (props: ActivityComponentProps, config: WidgetConfig) => {
          return <ActivityComponent activities={settingsConstants.exercises} showDistance={true} showDuration={true} {...props} config={config} />;
        },
        renderHistoryItem: (item: ActivityComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <ActivityHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: ActivityComponentWidgetType, config: WidgetConfig) => {
          return <ActivityCalendarComponent item={item} isSelectedItem={false} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.WATER]:
      {
        config: {
          widgetTitle: language.waterIntake,
          historyTitle: language.waterIntake,
          itemTypeName: ItemTypes.WATER,
          isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: language.water, name: 'cup', type: 'material-community' } as WidgetAddIconConfig,
          style: {} as ViewStyle,
          ratings: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        renderWidgetItem: (props: RatingComponentProps, config: WidgetConfig) => {
          return <RatingComponent iconName='cup' {...props} config={config} />;
        },
        renderHistoryItem: (item: RatingComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <RatingHistoryComponent iconName='cup' item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: RatingComponentWidgetType, config: WidgetConfig) => {
          return <RatingCalendarComponent iconName='cup' item={item} isSelectedItem={false} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.CREATE]:
      {
        config: {
          widgetTitle: 'Creativity', //TODO: language.waterIntake,
          historyTitle: 'Creativity', //TODO: language.waterIntake,
          itemTypeName: ItemTypes.CREATE,
          isQuickAccess: false, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: 'Create', name: 'creation', type: 'material-community' } as WidgetAddIconConfig,
          style: {} as ViewStyle
        },
        renderWidgetItem: (props: ActivityComponentProps, config: WidgetConfig) => {
          return <ActivityComponent activities={settingsConstants.creativity} showDuration={true} {...props} config={config} />;
        },
        renderHistoryItem: (item: ActivityComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <ActivityHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: ActivityComponentWidgetType, config: WidgetConfig) => {
          return <ActivityCalendarComponent item={item} isSelectedItem={false} config={config} />;
        }
      } as WidgetFactoryType,
    [ItemTypes.MEDITATE]:
      {
        config: {
          widgetTitle: 'Meditation (minutes)', //TODO: language.waterIntake,
          historyTitle: 'Meditation', //TODO: language.waterIntake,
          itemTypeName: ItemTypes.MEDITATE,
          isQuickAccess: false, /* means will show in the toolbar without having to press 'more' button */
          addIcon: { text: 'Meditate', name: 'spa', type: 'material-community' } as WidgetAddIconConfig,
          style: {} as ViewStyle,
          ratings: [1, 3, 5, 10, 15, 20, 30, 60]
        } as WidgetConfig,
        renderWidgetItem: (props: RatingComponentProps, config: WidgetConfig & { ratings: number[]}) => {
          return <RatingComponent iconName='spa' {...props} config={config} />;
        },
        renderHistoryItem: (item: RatingComponentWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <RatingHistoryComponent iconName='spa' item={item} isSelectedItem={isSelectedItem} config={config} />;
        },
        renderCalendarItem: (item: RatingComponentWidgetType, config: WidgetConfig) => {
          return <RatingCalendarComponent iconName='spa' item={item} isSelectedItem={false} config={config} hideText={true} />;
        }
      } as WidgetFactoryType,
  };

  return widgetFactory;
}

export interface WidgetBase extends ItemBase {
  type: string;
}

export interface WidgetComponentPropsBase {
  value: WidgetBase;
  selectedDate: Date,
  isSelected?: boolean;
  config: WidgetConfig;
  onChange?: (newValue: WidgetBase) => void
  onSelected?: (id: string) => void;
}

/** Config for icon that shows up in widget toolbar to add a new widget to the list of widgets */
export interface WidgetAddIconConfig {
  text: string;
  name: string;
  type: string;
}

/** General configuration for widgets e.g. title used on the history screen, styles etc */
export interface WidgetConfig {
  widgetTitle: string;
  historyTitle: string;
  itemTypeName: string;
  addIcon: WidgetAddIconConfig;
  style?: StyleProp<ViewStyle>;
  hideTitleInHeader?: boolean;
  isQuickAccess?: boolean; /* means will show in the toolbar without having to press 'more' button */
  isHorizontalHistoryRow?: boolean, /* on the history screen, show all items for the day in one row */
  icons?: CustomIconType[]
}

export interface WidgetFactory {
  [key: string]: WidgetFactoryType
}

export interface WidgetFactoryType {
  config: WidgetConfig;
  renderWidgetItem: (props: WidgetComponentPropsBase, config: WidgetConfig) => ReactNode;
  renderHistoryItem?: (item: WidgetBase, isSelectedItem: boolean, config: WidgetConfig) => ReactNode;
  renderCalendarItem?: (item: WidgetBase, config: WidgetConfig) => ReactNode;
}