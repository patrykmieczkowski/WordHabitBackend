export default class DateUtils {

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
