import React, { ReactNode } from 'react';
import { ItemTypes } from './Constants';
import { AppContextInterface } from './AppContext';
import { NoteComponent, NoteComponentProps, NoteComponentWidgetType, NoteHistoryComponent } from '../components/NoteComponent';
import { MoodComponent, MoodComponentProps, MoodComponentWidgetType, MoodHistoryComponent } from '../components/MoodComponent';
import { SleepComponent, SleepComponentProps, SleepComponentWidgetType, SleepHistoryComponent } from '../components/SleepComponent';
import { ImagePickerComponent, ImagePickerComponentProps, ImagePickerWidgetType, ImagePickerHistoryComponent } from '../components/ImagePickerComponent';
import { StyleProp, ViewStyle } from 'react-native';
import { CustomIconType } from '../components/CustomIconRating';
import { ItemBase } from './types';

export function CreateWidgetFactory(context: AppContextInterface) {
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
          style: { paddingVertical: 0, paddingTop: 20 } as ViewStyle
        } as WidgetConfig,
        renderWidgetItem: (props: ImagePickerComponentProps, config: WidgetConfig) => {
          return <ImagePickerComponent  {...props} config={config} readonly={false} />;
        },
        renderHistoryItem: (item: ImagePickerWidgetType, isSelectedItem: boolean, config: WidgetConfig) => {
          return <ImagePickerHistoryComponent item={item} isSelectedItem={isSelectedItem} config={config} />;
        }
      } as WidgetFactoryType
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
  onChange: (newValue: WidgetBase) => void
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
}