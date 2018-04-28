export default class DateUtils {

  static get _MilisecondsFor() {
    return {
      YEAR: 31536000000,
      MONTH: 2628000000,
      DAY: 86400000,
      HOUR: 3600000,
      MINUTE: 60000
    };
  }

  formatDate(date) {
    date = Number.isInteger(date) ? new Date(date) : date;

    return (
      `${this.getDayOfTheWeek(date.getDay())} ${this.getMonth(date.getMonth())} ` +
      `${this.padZeros(date.getDate(), 2)} ${this.padZeros(date.getFullYear(), 4)} ` +
      `${this.padZeros(date.getHours(), 2)}:${this.padZeros(date.getMinutes(), 2)}:${this.padZeros(date.getSeconds(), 2)}`
    );
  }

  getRangeBetween(date1, date2) {
    date1 = Number.isInteger(date1) ? date1 : date1.getTime();
    date2 = Number.isInteger(date2) ? date2 : date2.getTime();

    const range = Math.abs(date1 - date2);

    let formattedRange = ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE']
      .reduce((acc, timeName) => {
        const time = DateUtils._MilisecondsFor[timeName];
        if (acc.range >= time) {
          const count = Math.floor(acc.range / time);
          const totalTime = time * count;
          const formatSuffix = count > 1 ? 's' : '';
          acc.formattedRange.push(`${count} ${timeName.toLowerCase()}${formatSuffix}`);
          acc.range -= totalTime;
        }
        return acc;
      }, {range: range, formattedRange: []}).formattedRange.join(', ');

    if (formattedRange && date1 > date2)
      formattedRange = 'in ' + formattedRange;
    else if (formattedRange && date1 < date2)
      formattedRange += ' ago';

    return {range: range, formattedRange: formattedRange};
  }

  padZeros(n, len) {
    n = n.toString();
    return n.length >= len ? n : new Array(len - n.length + 1).join('0') + n;
  }

  getDayOfTheWeek(dayNumber) {
    return [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ][dayNumber];
  }

  getMonth(monthNumber) {
    return [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ][monthNumber];
  }
}
