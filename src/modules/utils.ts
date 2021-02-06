import moment from 'moment';
import 'react-native-get-random-values'; /** polyfills for uuid */
import { v4 as uuidv4 } from 'uuid';
import { StoreConstants } from './constants';
import { TranslationKeys } from './translations';
import { ItemBaseAssociativeArray } from './types';
import { WidgetBase } from './widgetFactory';

export function configLocale(locale: string) {
  /* make sure all needed locales are imported in translations file i.e. import 'moment/locale/ru'; */
  if (locale && moment.locale() !== locale)
    moment.locale(locale);

}

export function friendlyDate(date: string | Date, options: { language: TranslationKeys; }) {
  const format = 'YYYYMMDD';
  const newDate = moment(date);
  const newDateShortString = newDate.format(format);

  const today = moment();
  const yesterday = moment(addSubtractDays(today, -1));

  if (newDateShortString === today.format(format))
    return options.language.today;
  if (newDateShortString === yesterday.format(format))
    return options.language.yesterday;
  return newDate.format('dddd, MMM D');
}

export function friendlyDay(date: string | Date, options: { language: TranslationKeys; }) {
  const format = 'YYYYMMDD';
  const newDate = moment(date);
  const newDateShortString = newDate.format(format);

  const today = moment();
  const yesterday = moment(addSubtractDays(today, -1));

  if (newDateShortString === today.format(format))
    return options.language.today;
  if (newDateShortString === yesterday.format(format))
    return options.language.yesterday;
  return newDate.format('dddd');
}

export function friendlyTime(date: string | Date) {
  return moment(date).format('LT');
}

export function getStorageKeyFromDate(date: string | Date) {
  return StoreConstants.keyPrefix + formatDate(date, StoreConstants.keyDateFormat);
}

export function formatDate(date: string | Date, format: string) {
  return moment(date).format(format);
}

export function updateTimeStringToNow(dateString: string) {
  const result = moment(dateString);
  const now = moment();

  result.hours(now.hours());
  result.minutes(now.minute());
  result.seconds(now.seconds());
  result.milliseconds(now.milliseconds());

  return result.toISOString();
}

export function isDate(value: any) {
  return moment.isDate(value);
}

export function isValidDate(value: any) {
  try {
    const date = moment(new Date(value));
    return date.isValid();
  }
  catch (error) {
    return false;
  }
}

export function isNullOrEmpty(value: any) {
  if (!value || value === undefined || value === null || (value + '').trim() === '')
    return true;
  return false;
}

export function isEmptyWidgetItem(item: any) {
  /* items with 'type' property are widget items and we want to check those if they are not empty */
  if (Object.keys(item).indexOf('type') < 0)
    return false;

  /* if an item only has an id property we don't want to save it because it is an empty item
  added by the plus button but not updated by the user */
  const emptyItemFields = ['id', 'date', 'type'];
  return (Object.keys(item).filter(key => emptyItemFields.indexOf(key) < 0).length === 0);
}

export function addSubtractDays(date: string | Date | moment.Moment, numDays: number) {
  if (numDays < 0 || numDays > 0)
    return moment(date).add(numDays, 'days');
  return date;
}

export function dateDiff(dateA: string | Date, dateB: string | Date) {
  return moment(dateB).diff(moment(dateA));
}

export function updateArrayImmutable(array: any[], newValue: any) {
  /* without mutating the array, update an item if found by id or if id is blank but matches on date field as when adding a new record */
  return mergeArraysImmutable(array, [newValue]);
}

export function mergeArraysImmutable(array1: any[], array2: any[]) {
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

export function getHashtagsFromText(text: string) {
  /* .match(/#([^ |#]*)/gm) will match all strings surrounded by # and space (or another #) allowing special characters in the string

   this input:
      #tag1 #tag-2 #tag3#tag4 #tag!@$5

   will produce these matches:
      ["#tag1","#tag-2","#tag3","#tag4","#tag!@$5"]

*/
  return text.match(/#([^ |#]*)/gm) || [];
}

export function wait(timeout: number) {
  return new Promise(resolve => {
    // eslint-disable-next-line no-restricted-globals
    setTimeout(resolve, timeout);
  });
}

export function getNewUuid() {
  return uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
}

export function groupBy(list: any[], keyGetter: any, appendToMap?: Map<any, any>) {
  /* new map or append to existing map e.g. when items are in multiple lists by month in storage but need to be grouped by item type */
  const map = appendToMap ? appendToMap : new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection)
      map.set(key, [item]);
    else
      collection.push(item);

  });
  return map;
}

export function filterByItemType(items: ItemBaseAssociativeArray, itemType: string) {
  const result = [] as WidgetBase[];

  if (!items)
    return result;
  Object.keys(items).forEach((key: string) => {
    if (!items[key])
      return;
    const filtered = (items[key] as WidgetBase[]).filter((item: WidgetBase) => item.type === itemType);
    filtered.forEach((filteredItem: WidgetBase) => {
      if (!isEmptyWidgetItem(filteredItem))
        result.push(filteredItem);
    });
  });
  return result.sort((b: WidgetBase, a: WidgetBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
}

export const consoleColors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

export function consoleLogWithColor(message: string, color?: string) {
  /* changes the color of console log statements and needs to be reset after
    console.log('\x1b[32m', 'this text is green', '\x1b[0m'); */
  if (__DEV__)
    console.log(color ? color : consoleColors.green, message, consoleColors.reset);
}
