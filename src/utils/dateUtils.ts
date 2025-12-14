import { DateTime } from "luxon";

export interface DateRange {
  start: DateTime;
  end: DateTime;
  startFormatted: string;
  endFormatted: string;
}

/**
 * 先月の期間を計算する（月初〜月末）
 */
export const calculateLastMonthRange = (): DateRange => {
  const now = DateTime.now();
  const start = now.minus({ months: 1 }).startOf("month");
  const end = now.minus({ months: 1 }).endOf("month");

  return {
    start,
    end,
    startFormatted: start.toFormat("yyyy/MM/dd"),
    endFormatted: end.toFormat("yyyy/MM/dd"),
  };
};

/**
 * 今月の期間を計算する（月初〜今日）
 */
export const calculateCurrentMonthRange = (): DateRange => {
  const now = DateTime.now();
  const start = now.startOf("month");
  const end = now;

  return {
    start,
    end,
    startFormatted: start.toFormat("yyyy/MM/dd"),
    endFormatted: end.toFormat("yyyy/MM/dd"),
  };
};
