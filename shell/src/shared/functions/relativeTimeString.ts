import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// dayjs.extend(relativeTime);

export default function relativeTimeString(
  time: string,
  relativeDaysBase: number,
  showHours: boolean = false
) {
  if (!time) {
    return null;
  }
  const convertedTime = new Date(Date.parse(time));
  let now = new Date();

  let relativeDaysAgo = now.setDate(now.getDate() - relativeDaysBase);

  if (relativeDaysAgo > convertedTime.getTime()) {
    if (showHours) {
      return dayjs(convertedTime).format("D.MM.YYYY HH:mm");
    } else {
      return dayjs(convertedTime).format("D.MM.YYYY");
    }
  } else {
    return dayjs().to(dayjs(convertedTime));
  }
}
