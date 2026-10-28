import moment from "moment";
import derived from "./derived";

describe("isValid function", () => {
  const mockMoment = (date: string) => moment(date);

  it("should return true when isDirty is false", () => {
    const props = { isDirty: false };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should return true when selectedDate is null and not required", () => {
    const props = { isDirty: true, isRequired: false, selectedDate: null };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should return false when selectedDate is null and required", () => {
    const props = { isDirty: true, isRequired: true, selectedDate: null };

    expect(derived.isValid(props, mockMoment)).toBe(false);
  });

  it("should return true when selectedDate is between minDate and maxDate", () => {
    const props = {
      isDirty: true,
      minDate: "2023-01-01",
      maxDate: "2023-12-31",
      selectedDate: "2023-06-15",
    };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should return false when selectedDate is before minDate", () => {
    const props = {
      isDirty: true,
      minDate: "2023-01-01",
      selectedDate: "2022-12-31",
    };

    expect(derived.isValid(props, mockMoment)).toBe(false);
  });

  it("should return false when selectedDate is after maxDate", () => {
    const props = {
      isDirty: true,
      maxDate: "2023-12-31",
      selectedDate: "2024-01-01",
    };

    expect(derived.isValid(props, mockMoment)).toBe(false);
  });

  it("should return true when selectedDate is valid and no min/max dates are set", () => {
    const props = {
      isDirty: true,
      selectedDate: "2023-06-15",
    };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  // The widget stores a picked day as local midnight, e.g. picking
  // 2023-01-01 gives moment("2023-01-01T00:00:00").toISOString().
  const pickedDay = (day: string) => moment(`${day}T00:00:00`).toISOString();

  it("should return true when the picked day is the min date", () => {
    const props = {
      isDirty: true,
      timePrecision: "day",
      minDate: "2023-01-01",
      selectedDate: pickedDay("2023-01-01"),
    };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should return true when the picked day is the max date", () => {
    const props = {
      isDirty: true,
      timePrecision: "day",
      maxDate: "2023-12-31",
      selectedDate: pickedDay("2023-12-31"),
    };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should include both bounds when min and max date are set", () => {
    const props = {
      isDirty: true,
      timePrecision: "day",
      minDate: "2023-01-01",
      maxDate: "2023-12-31",
    };

    expect(
      derived.isValid(
        { ...props, selectedDate: pickedDay("2023-01-01") },
        mockMoment,
      ),
    ).toBe(true);
    expect(
      derived.isValid(
        { ...props, selectedDate: pickedDay("2023-12-31") },
        mockMoment,
      ),
    ).toBe(true);
    expect(
      derived.isValid(
        { ...props, selectedDate: pickedDay("2024-01-01") },
        mockMoment,
      ),
    ).toBe(false);
  });

  it("should compare by day when time precision is day", () => {
    const props = {
      isDirty: true,
      timePrecision: "day",
      minDate: moment("2023-01-01T15:30:00").toISOString(),
      selectedDate: pickedDay("2023-01-01"),
    };

    expect(derived.isValid(props, mockMoment)).toBe(true);
  });

  it("should compare by minute when time precision is minute", () => {
    const props = {
      isDirty: true,
      timePrecision: "minute",
      minDate: moment("2023-01-01T15:30:00").toISOString(),
    };

    expect(
      derived.isValid(
        {
          ...props,
          selectedDate: moment("2023-01-01T15:29:00").toISOString(),
        },
        mockMoment,
      ),
    ).toBe(false);
    expect(
      derived.isValid(
        {
          ...props,
          selectedDate: moment("2023-01-01T15:30:00").toISOString(),
        },
        mockMoment,
      ),
    ).toBe(true);
  });
});
