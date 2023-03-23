import dayjs from "dayjs";

/**
 * DateをYYYY-MM-DD形式の文字列に変換する
 */
export function toISODateString(date: Date): string {
  console.log(dayjs(date).format());

  return dayjs(date).format("YYYY-MM-DD");
}
