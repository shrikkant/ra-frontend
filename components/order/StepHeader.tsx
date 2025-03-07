import React from "react";

interface StepHeaderProps {
  children?;
  label: string;
}

export const StepHeader = ({
  children,
  label,
}: StepHeaderProps) => {
  return (
    <div className={"border-b border-gray-300 pb-2 pt-3"}>
      <div className={"flex justify-between items-center"}>
        <div className={"flex space-x-5 text-xl font-bold"}>
          <div>{label} </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
