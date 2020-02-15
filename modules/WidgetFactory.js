import React from 'react';
import { Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../assets/styles/style';
import { CustomIconRating, CustomIconRatingItem } from '../components/CustomIconRating';
import NoteComponent from '../components/NoteComponent';
import { SleepComponent } from '../components/SleepComponent';
import { ItemTypes, text } from './Constants';
import { formatDate, friendlyDate, friendlyTime } from './helpers';

export const WidgetFactory = {
  [ItemTypes.NOTE]:
  {
    config: {
      widgetTitle: 'Note',
      editableTitle: true,
      itemTypeName: ItemTypes.NOTE,
      isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
      addIcon: { text: 'note', name: 'pencil-square-o', type: 'font-awesome' },
      style: {}
    },
    renderWidgetItem: (item, selectedDate, config, onChange) => {
      return (
        <NoteComponent value={item} onChange={onChange} />
      );
    }
  },
  [ItemTypes.MOOD]:
  {
    config: {
      widgetTitle: 'Mood',
      itemTypeName: ItemTypes.MOOD,
      isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
      isHorizontalHistoryRow: true, /* on the history screen, show all items for the day in one row */
      addIcon: { text: 'mood', name: 'smile-o', type: 'font-awesome' },
      style: {},
      icons: [
        { name: 'Happy', icon: 'mood-happy', iconStyle: {}, backgroundStyle: { backgroundColor: '#ff9a55' } },
        { name: 'So-so', icon: 'mood-neutral', iconStyle: {}, backgroundStyle: { backgroundColor: '#009898' } },
        { name: 'Could be better', icon: 'mood-sad', iconStyle: {}, backgroundStyle: { backgroundColor: '#517fa4' } }
      ]
    },
    renderWidgetItem: (item, selectedDate, config, onChange) => {
      const ratings = config.icons.map((icon, index) => {
        return (
          <CustomIconRatingItem key={index} id={index} value={icon}
            selected={item && item.rating === index}
            onPress={(rating) => {
              if (!Number.isInteger(rating))
                return; //nothing to do since rating wasn't selected
              if (onChange)
                onChange({ ...item, rating });
            }} />
        )
      }); 
      return (
        <Animatable.View animation="fadeIn" duration={500}>
          <CustomIconRating>{ratings}</CustomIconRating>
        </Animatable.View>
      );
    },
    renderHistoryItem: (item, isSelectedItem, config) => {
      /* config is basically this object i.e config[itemType]  */
      /* custom render item to show mood icon in the row */
      const moodRatingIcons = config.icons;
      const ratingIcon = moodRatingIcons[item.rating] ? moodRatingIcons[item.rating] : {};
      return (
        <View style={{margin: 7}}>
            <Text style={isSelectedItem ? [styles.bodyText, styles.highlightText] : styles.bodyText}>
              {friendlyTime(item.date)}</Text>
            <CustomIconRatingItem value={ratingIcon} size={40} />
        </View>
      );
    }
  },
  [ItemTypes.SLEEP]:
  {
    config: {
      widgetTitle: 'Sleep',
      itemTypeName: ItemTypes.SLEEP,
      isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
      addIcon: { text: 'sleep', name: 'moon-o', type: 'font-awesome' },
      style: {},
      icons: [
        { name: 'Restful', icon: 'sleep-happy', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#ff9a55' } },
        { name: 'Interrupted', icon: 'sleep-neutral', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#009898' } },
        { name: 'Poor', icon: 'sleep-sad', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#517fa4' } }
      ]
    },
    renderWidgetItem: (item, selectedDate, config, onChange) => {
      return (
        <SleepComponent value={item} config={config} selectedDate={selectedDate} onChange={onChange} />
      );
    },
    renderHistoryItem: (item, isSelectedItem, config) => {
      const sleepRatingIcons = config.icons;
      const ratingIcon = sleepRatingIcons[item.rating] ? sleepRatingIcons[item.rating] : {};
      return (
        <View style={styles.row}>
          <View style={[styles.flex, styles.centered]}>
            <CustomIconRatingItem value={ratingIcon} size={40} />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
              {(item.startDate) ? text.sleepHistoryScreen.bedTime + formatDate(item.startDate, 'h:mm A') : ''}</Text>
            <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightText] : styles.subTitleText}>
              {(item.endDate) ? text.sleepHistoryScreen.wakeTime + formatDate(item.endDate, 'h:mm A') : ''}</Text>
          </View>
        </View>
      );
    }
  },
  'custom':
  {
    config: {
      widgetTitle: 'Custom Widget',
      editableTitle: true,
      itemTypeName: 'custom',
      addIcon: { text: 'note', name: 'pencil', type: 'font-awesome' },
      style: {}
    },
    renderWidgetItem: (item, selectedDate, config, onChange) => {
      return (
        <Text>Hi</Text>
      );
    }
  }
}