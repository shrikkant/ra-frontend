import { timeAgo } from "../util/date.util";

export function Time({ time }) {
  return <span>{timeAgo(time)}</span>;
}
