import React from "react";

interface StepHeaderProps {
  children?: any;

  onChangeAction?: any;
  label: string;
  showChange?: boolean;
}

export const StepHeader = ({
  children,
  onChangeAction,
  label,
  showChange
}: StepHeaderProps) => {
  return (
    <div className={"border-b border-gray-300 pb-2 pt-3"}>
      <div className={"flex justify-between items-center"}>
        <div className={"flex space-x-5 text-xl font-bold"}>
          <div>{label} </div>
          <div>{children}</div>
        </div>
        {showChange && onChangeAction && (
          <button
            onClick={() => {
              onChangeAction();
            }}
          >
            Change
          </button>
        )}
      </div>
    </div>
  );
};
