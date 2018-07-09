export function getDate() {
  const weekDay = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  let date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getYear();
  let day = date.getDate();

  var dateString = '';
  if (month < 10) dateString += 0;
  dateString += month + '.';
  if (day < 10) dateString += 0;
  dateString += day + '.' + (year + 1900);

  var timeString = '';
  var hour = date.getHours();
  let minute = date.getMinutes();
  let amPm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  if (hour < 10) timeString += '0';
  timeString += hour + ':';
  if (minute < 10) timeString += '0';
  timeString += minute + ' ' + amPm;

  let dayIndex = date.getDay();
  return {
    dateString,
    timeString,
    weekDay: weekDay[dayIndex],
  };
}

export async function getBitcoinMarketPrice(timespan = 'all', startDate = undefined) {
  var url = `https://blockchain.info/charts/market-price?format=json&timespan=${timespan}`;
  if (startDate) {
    url += '&start=' + startDate;
  }
  var response = await fetch(url);
  response = await response.json();
  return response.values;
}
