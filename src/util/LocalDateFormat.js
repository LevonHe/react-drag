import intl from 'react-intl-universal';
import { isNumber } from 'util';

const LocalDateFormat = {
  formatLocalDateTime(value, type) {
    if (!value) {
      return '--';
    }
    if (!isNumber(value)) {
      // eslint-disable-next-line no-param-reassign
      value = parseInt(value, 10);
    }
    let timestamp = value;
    if (timestamp.length === 10) {
      timestamp = value * 1000;
    }
    let result = '';
    const lang = intl.options.currentLocale;
    if (lang === 'zh-CN') {
      result = this.formatZhDateTime(timestamp, type);
    } else if (lang === 'en-US') {
      result = this.formatEnDateTime(timestamp, type);
    }
    return result;
  },
  formatZhDateTime(timestamp, type) {
    const dateTime = new Date(timestamp);
    const year = dateTime.getFullYear();
    const month = this.formatSingleNumber(dateTime.getMonth() + 1);
    const day = this.formatSingleNumber(dateTime.getDate());
    const hour = this.formatSingleNumber(dateTime.getHours());
    const minute = this.formatSingleNumber(dateTime.getMinutes());
    const second = this.formatSingleNumber(dateTime.getSeconds());
    if (type === 'date') {
      return year + '/' + month + '/' + day;
    }
    return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second; // + " " + this.getZoneSuffix(dateTime);
  },
  formatEnDateTime(timestamp, type) {
    const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Spt', 'Oct', 'Nov', 'Dec'];
    const dateTime = new Date(timestamp);
    const year = dateTime.getFullYear();
    const month = monthArr[dateTime.getMonth()];
    const day = this.formatSingleNumber(dateTime.getDate());
    const hour = this.formatSingleNumber(dateTime.getHours());
    const minute = this.formatSingleNumber(dateTime.getMinutes());
    const second = this.formatSingleNumber(dateTime.getSeconds());
    if (type === 'date') {
      return month + ' ' + day + ', ' + year;
    }
    return month + ' ' + day + ', ' + year + ' ' + hour + ':' + minute + ':' + second; // + " " + this.getZoneSuffix(dateTime);
  },
  formatSingleNumber(value) {
    return value < 10 ? '0' + value : value;
  },
  getZoneSuffix(dateTime) {
    const offset = -(dateTime.getTimezoneOffset() / 60);
    const symbol = offset >= 0 ? '+' : '-';
    const timeOffset = this.formatSingleNumber(offset);
    return 'GMT' + symbol + timeOffset + ':00';
  },
};

export default LocalDateFormat;
