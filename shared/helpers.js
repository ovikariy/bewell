export const friendlyDateFormat = (date) => {
    const dateObj = new Date(date);
    const dateShortString = dateObj.getFullYear() + dateObj.getMonth() + dateObj.getDate();
    const dateTimeString = dateObj.getHours() + ':' + dateObj.getMinutes();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateShortString === (today.getFullYear() + today.getMonth() + today.getDate()))
      return 'Today at ' + dateTimeString;
    if (dateShortString === (yesterday.getFullYear() + yesterday.getMonth() + yesterday.getDate()))
      return 'Yesterday at ' + dateTimeString;
    return dateObj.toLocaleString();
  }