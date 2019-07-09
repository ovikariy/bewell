import moment from 'moment';

export const friendlyDate = (date) => {
  //TODO: test with timezones
  const newDate = new Date(date);
  const newDateShortString = newDate.getFullYear() + newDate.getMonth() + newDate.getDate();
  const newDateTimeString = (newDate.getHours() < 10 ? '0' : '') + newDate.getHours() + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (newDateShortString === (today.getFullYear() + today.getMonth() + today.getDate()))
    return 'Today at ' + newDateTimeString;
  if (newDateShortString === (yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate()))
    return 'Yesterday at ' + newDateTimeString;
  return moment(newDate).format('dddd, MMM D');
}

export const friendlyTime = (date) => {
  return moment(date).format('LT');
}