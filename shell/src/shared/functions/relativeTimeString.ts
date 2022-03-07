import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// dayjs.extend(relativeTime);

export default function relativeTimeString(
  time: string,
  relativeDaysBase: number
) {
  if (!time) {
    return null;
  }
  const convertedTime = new Date(Date.parse(time));
  let now = new Date();

  let relativeDaysAgo = now.setDate(now.getDate() - relativeDaysBase);

  if (relativeDaysAgo > convertedTime.getTime()) {
    return dayjs(convertedTime).format("D. MM. YYYY");
  } else {
    return dayjs().to(dayjs(convertedTime));
  }
}
