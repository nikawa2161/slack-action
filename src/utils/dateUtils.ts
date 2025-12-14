import { DateTime } from "luxon";

export interface DateRange {
  start: DateTime;
  end: DateTime;
  startFormatted: string;
  endFormatted: string;
}

/**
 * 先月の期間を計算する
 */
export function calculateLastMonthRange(): DateRange {
  const now = DateTime.now();
  const start = now.minus({ months: 1 }).startOf("month");
  const end = now.minus({ months: 1 }).endOf("month");

  return {
    start,
    end,
    startFormatted: start.toFormat("yyyy/MM/dd"),
    endFormatted: end.toFormat("yyyy/MM/dd"),
  };
}
