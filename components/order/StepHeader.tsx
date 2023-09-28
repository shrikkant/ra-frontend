interface StepHeaderProps {
  children?: any;
  index: number;
  onChangeAction?: any;
  label: string;
}

export const StepHeader = ({
  children,
  index,
  onChangeAction,
  label,
}: StepHeaderProps) => {
  return (
    <div className={"border-b border-gray-300 pb-2 pt-3"}>
      <div className={"flex justify-between items-center"}>
        <div className={"flex space-x-5 text-xl font-bold"}>
          <div>{index}</div>
          <div>{label} </div>
          <div>{children}</div>
        </div>
        {onChangeAction && (
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
