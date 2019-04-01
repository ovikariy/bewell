
import * as ItemTypes from '../constants/ItemTypes';

export const widgetConfig = {
  [ItemTypes.MOOD]:
  {
    itemTypeName: ItemTypes.MOOD, historyScreenName: 'MoodHistory', color: '#f0ad4e', multiItem: true
  },
  [ItemTypes.SLEEP]:
  {
    itemTypeName: ItemTypes.SLEEP, historyScreenName: 'SleepHistory', color: '#9F86FF'
  },
  [ItemTypes.GRATITUDE]:
  {
    itemTypeName: ItemTypes.GRATITUDE, historyScreenName: 'GratitudeHistory', color: '#1BC98E', multiItem: true
  },
  [ItemTypes.DREAM]:
  {
    itemTypeName: ItemTypes.DREAM, historyScreenName: 'DreamHistory', color: '#E4D836'
  },
  [ItemTypes.NOTE]:
  {
    itemTypeName: ItemTypes.NOTE, historyScreenName: 'NoteHistory', color: '#1997c6'
  }
}