import React from "react";
import { timeAgo } from "../util/date.util";

interface TimeProps {
  time: string;
}
export function Time({ time }: TimeProps) {
  return <span>{timeAgo(time)}</span>;
}
