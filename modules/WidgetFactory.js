import React from 'react';
import { Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../assets/styles/style';
import { CustomIconRating, CustomIconRatingItem } from '../components/CustomIconRating';
import { SleepComponent } from '../components/SleepComponent';
import { ItemTypes, text } from './Constants';
import { formatDate, friendlyTime } from './helpers';
import { ClearTextArea } from '../components/MiscComponents';

export function WidgetFactory(context) {
  const language = context;
  return {
    [ItemTypes.NOTE]:
    {
      config: {
        widgetTitle: language.note,
        historyTitle: language.notes,
        itemTypeName: ItemTypes.NOTE,
        isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
        addIcon: { text: language.note, name: 'pencil-square-o', type: 'font-awesome' },
        style: {}
      },
      renderWidgetItem: (props, config) => {
        return (
          <ClearTextArea
            numberOfLines={1}
            placeholder={language.whatsOnYourMind}
            value={props.value ? props.value.note : null}
            onChangeText={(note) => { props.onChange({ ...props.value, note }) }}
          />
        );
      }
    },
    [ItemTypes.MOOD]:
    {
      config: {
        widgetTitle: language.mood,
        historyTitle: language.moods,
        itemTypeName: ItemTypes.MOOD,
        isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
        isHorizontalHistoryRow: true, /* on the history screen, show all items for the day in one row */
        addIcon: { text: language.mood, name: 'smile-o', type: 'font-awesome' },
        style: {},
        icons: [
          { name: language.happy, icon: 'mood-happy', iconStyle: {}, backgroundStyle: { backgroundColor: '#ff9a55' } },
          { name: language.soso, icon: 'mood-neutral', iconStyle: {}, backgroundStyle: { backgroundColor: '#009898' } },
          { name: language.couldBeBetter, icon: 'mood-sad', iconStyle: {}, backgroundStyle: { backgroundColor: '#517fa4' } }
        ]
      },
      renderWidgetItem: (props, config) => {
        const ratings = config.icons.map((icon, index) => {
          return (
            <CustomIconRatingItem key={index} id={index} value={icon}
              selected={props.value && props.value.rating === index}
              onPress={(rating) => {
                if (!Number.isInteger(rating))
                  return; //nothing to do since rating wasn't selected
                if (props.onChange)
                  props.onChange({ ...props.value, rating });
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
          <View style={{ margin: 7 }}>
            <Text style={isSelectedItem ? [styles.bodyText, styles.highlightColor] : styles.bodyText}>
              {friendlyTime(item.date)}</Text>
            <CustomIconRatingItem value={ratingIcon} size={40} />
          </View>
        );
      }
    },
    [ItemTypes.SLEEP]:
    {
      config: {
        widgetTitle: language.sleep,
        historyTitle: language.sleeps,
        itemTypeName: ItemTypes.SLEEP,
        isQuickAccess: true, /* means will show in the toolbar without having to press 'more' button */
        addIcon: { text: language.sleep, name: 'moon-o', type: 'font-awesome' },
        style: {},
        icons: [
          { name: language.restful, icon: 'sleep-happy', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#ff9a55' } },
          { name: language.interrupted, icon: 'sleep-neutral', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#009898' } },
          { name: language.poor, icon: 'sleep-sad', iconStyle: { color: '#ffffff' }, backgroundStyle: { backgroundColor: '#517fa4' } }
        ]
      },
      renderWidgetItem: (props, config) => {
        return (
          <SleepComponent {...props} config={config} />
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
              <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
                {(item.startDate) ? language.bedTime + formatDate(item.startDate, 'h:mm A') : ''}</Text>
              <Text style={isSelectedItem ? [styles.subTitleText, styles.highlightColor] : styles.subTitleText}>
                {(item.endDate) ? language.wakeTime + formatDate(item.endDate, 'h:mm A') : ''}</Text>
            </View>
          </View>
        );
      }
    },
    'custom':
    {
      config: {
        widgetTitle: 'Custom Widget',
        itemTypeName: 'custom',
        addIcon: { text: language.note, name: 'pencil', type: 'font-awesome' },
        style: {}
      },
      renderWidgetItem: (props, config) => {
        return (
          <Text>Hi</Text>
        );
      }
    }
  }
}