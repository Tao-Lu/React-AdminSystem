/* eslint-disable import/prefer-default-export */
export function formateDate(time) {
  if (!time) return '';

  let currentDate = new Date(time);

  currentDate = `${currentDate.toLocaleDateString('en-AU')} ${currentDate.toLocaleTimeString('en-AU')}`;

  return currentDate;
}
