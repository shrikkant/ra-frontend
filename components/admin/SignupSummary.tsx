import React from "react";


interface SignupStat {
  month: number;
  signups: number;
}

interface SignupSummaryProps {
  signupStats: SignupStat[];
};


export function SignupSummary({ signupStats }: SignupSummaryProps) {
  const current = signupStats[0] ? signupStats[0].signups : 0;
  const previous = signupStats[1] ? signupStats[1].signups : 0;
  const growth =
    previous > 0 ? Math.round(((current / previous) - 1) * 100) : 0;

  return (<div className="flex gap-x-4 border border-gray-300 p-4 rounded-md">
    <div>
      <span className="text-2xl font-semibold text-green-600">
        {current}
      </span>
      {growth != 0 &&
        <span className={
          (growth > 0 ? "text-green-400" : "text-red-500") +
          " pl-2 text-sm"}>
          {growth}%
        </span>
      }
    </div>

  </div>)
}
