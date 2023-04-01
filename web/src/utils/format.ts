import dayjs from "dayjs";

/**
 * DateをYYYY-MM-DD形式の文字列に変換する
 */
export function formatDate(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}
