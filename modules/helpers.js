import moment from 'moment';
import { text } from './Constants';

export const friendlyDate = (date, options) => {
  //TODO: test with timezones
  const newDate = new Date(date);
  const newDateShortString = newDate.getFullYear() + newDate.getMonth() + newDate.getDate();
  const newDateTimeString = (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const showLongFormat = options && options.showLongFormat ? options.showLongFormat : false; /* show day name and date 'Today, Apr 1 2019' */
  const showTime = options && options.showTime ? options.showTime : false;                    /* show time 'at 1:20pm' */
  const resultDateTimeString = (showLongFormat ? ', ' + moment(newDate).format('MMM D YYYY') : '') + (showTime ? ' ' + text.general.at + ' ' + newDateTimeString : '');

  if (newDateShortString === (today.getFullYear() + today.getMonth() + today.getDate()))
    return text.general.today + resultDateTimeString;
  if (newDateShortString === (yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate()))
    return text.general.yesterday + resultDateTimeString;
  return moment(newDate).format('dddd, MMM D');
}

export const friendlyTime = (date) => {
  return moment(date).format('LT');
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

export function addSubtractDays(date, numDays) {
  if (numDays < 0 || numDays > 0)
    return moment(date).add(numDays, 'days');
  return date;
}

export const updateArrayImmutable = (array, newValue) => {
  /* without mutating the array, update an item if found by id or if id is blank but matches on date field as when adding a new record */
  if (!array)
    return [newValue];
  let index = array.findIndex(item => (item.id && item.id === newValue.id)); //try to match by id
  if (index < 0)
    index = array.findIndex(item => (!item.id && item.date === newValue.date)); //try to match by date where id is blank
  if (index < 0)
    return [...array, newValue];

  array = [...array];
  array[index] = newValue;
  return array;
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