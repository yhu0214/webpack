import moment from 'moment';

export default {
  filters: {
    // @see http://momentjs.com/docs/#/parsing/string-format for format syntax
    toDateTime(format, date) {
      if (date !== undefined) {
        return moment(date).format(format);
      }

      return moment().format(format);
    },
    secondsToMinutes(secs) {
      return moment.duration(secs, 'seconds').asMinutes();
    },
  },
};
