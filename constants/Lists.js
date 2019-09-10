
import { ItemTypes } from '../constants/Constants';

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
  [ItemTypes.NOTE]:
  {
    itemTypeName: ItemTypes.NOTE, historyScreenName: 'NoteHistory', color: '#1997c6'
  }
}