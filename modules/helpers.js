import moment from 'moment';
import { text, storeConstants } from './Constants';

export const friendlyDate = (date, options) => {
  //TODO: test with timezones
  const format = 'YYYYMMDD';
  const newDate = moment(date);
  const newDateShortString = newDate.format(format);
  const newDateTimeString = newDate.format('LT');

  const today = moment();
  const yesterday = addSubtractDays(today, -1);

  const showLongFormat = options && options.showLongFormat ? options.showLongFormat : false; /* show day name and date 'Today, Apr 1 2019' */
  const showTime = options && options.showTime ? options.showTime : false;                    /* show time 'at 1:20pm' */
  const resultDateTimeString = (showLongFormat ? ', ' + newDate.format('MMM D') : '') + (showTime ? ' ' + text.general.at + ' ' + newDateTimeString : '');

  if (newDateShortString === today.format(format))
    return text.general.today + resultDateTimeString;
  if (newDateShortString === yesterday.format(format))
    return text.general.yesterday + resultDateTimeString;
  return newDate.format('dddd, MMM D');
}

export const friendlyDay = (date) => {
  //TODO: test with timezones
  const format = 'YYYYMMDD';
  const newDate = moment(date);
  const newDateShortString = newDate.format(format);

  const today = moment();
  const yesterday = addSubtractDays(today, -1);

  if (newDateShortString === today.format(format))
    return text.general.today;
  if (newDateShortString === yesterday.format(format))
    return text.general.yesterday;
  return newDate.format('dddd');
}

export const friendlyTime = (date) => {
  return moment(date).format('LT');
}

export function getStorageKeyFromDate(date) {
  return storeConstants.keyPrefix + formatDate(date, storeConstants.keyDateFormat);
}

export function formatDate(date, format) {
  return moment(date).format(format);
}

export function updateTimeStringToNow(dateString) {
  const result = moment(dateString);
  const now = moment();

  result.hours(now.hours());
  result.minutes(now.minute());
  result.seconds(now.seconds());
  result.milliseconds(now.milliseconds());

  return result.toISOString();
}

export function isDate(value) {
  return moment.isDate(value);
}

export function isEmptyWidgetItem(item) {
  /* items with 'type' property are widget items and we want to check those if they are not empty */
  if (Object.keys(item).indexOf('type') < 0)
    return false;

  /* if an item only has an id property we don't want to save it because it is an empty item
  added by the plus button but not updated by the user */
  const emptyItemFields = ['id', 'date', 'type'];
  return (Object.keys(item).filter(key => emptyItemFields.indexOf(key) < 0).length === 0)
}

export function addSubtractDays(date, numDays) {
  if (numDays < 0 || numDays > 0)
    return moment(date).add(numDays, 'days');
  return date;
}

export function updateArrayImmutable(array, newValue) {
  /* without mutating the array, update an item if found by id or if id is blank but matches on date field as when adding a new record */
  return mergeArraysImmutable(array, [newValue]);
}

export function mergeArraysImmutable(array1, array2) {
  if (!array1 || (array1.length <= 0))
    return [...array2];
  if (!array2 || (array2.length <= 0))
    return [...array1];

  const result = [...array1];

  array2.forEach(element => {
    let index = result.findIndex(item => (item.id && item.id === element.id)); //try to match by id
    if (index < 0)
      index = result.findIndex(item => (!item.id && item.date === element.date)); //try to match by date where id is blank
    if (index < 0)
      result.push(element);
    else
      result[index] = element;
  });

  return result;
}

export function getHashtagsFromText(text) {
  /* .match(/#([^ |#]*)/gm) will match all strings surrounded by # and space (or another #) allowing special characters in the string
 
   this input:
      #tag1 #tag-2 #tag3#tag4 #tag!@$5

   will produce these matches:
      ["#tag1","#tag-2","#tag3","#tag4","#tag!@$5"]

*/
  return text.match(/#([^ |#]*)/gm) || [];
}

export function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function getNewUuid() {
  //TODO: use a library mentioned in this answer for better reliability
  //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function groupBy(list, keyGetter, appendToMap) {
  /* new map or append to existing map e.g. when items are in multiple lists by month in storage but need to be grouped by item type */
  const map = appendToMap ? appendToMap : new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function consoleLogWithColor(color, message) {
  /* changes the color of console log statements and needs to be reset after
    console.log('\x1b[32m', 'this text is green', '\x1b[0m'); */
  const consoleColors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
  }

  console.log(color ? color : consoleColors.green, message, consoleColors.reset);
}
