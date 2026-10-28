export default {
  isValid: (props, moment) => {
    // Parse with moment, the same way the widget parses minDate and maxDate
    // for the picker, so a date-only string is local midnight in both places.
    // new Date() reads a date-only string as UTC midnight.
    const parsedMinDate = props.minDate ? moment(props.minDate) : null;
    const parsedMaxDate = props.maxDate ? moment(props.maxDate) : null;
    const parsedSelectedDate = props.selectedDate
      ? moment(props.selectedDate)
      : null;

    // only do validation when the date is dirty
    if (!props.isDirty) {
      return true;
    }

    if (!parsedSelectedDate && !props.isRequired) {
      return true;
    }

    if (!parsedSelectedDate && props.isRequired) {
      return false;
    }

    // The picker lets the user pick minDate and maxDate, so both bounds are
    // inclusive, compared at the widget's time precision.
    const granularity = props.timePrecision || "day";

    if (parsedMinDate && parsedMaxDate) {
      return parsedSelectedDate.isBetween(
        parsedMinDate,
        parsedMaxDate,
        granularity,
        "[]",
      );
    }

    if (parsedMinDate) {
      return parsedSelectedDate.isSameOrAfter(parsedMinDate, granularity);
    }

    if (parsedMaxDate) {
      return parsedSelectedDate.isSameOrBefore(parsedMaxDate, granularity);
    }

    return true;
  },
};
