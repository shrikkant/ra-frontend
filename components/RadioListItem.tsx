export const RadioListItem = ({ value, active, children, onCheck }) => {
  return (
    <div
      onClick={() => {
        onCheck(value);
      }}
      className={
        "flex p-3 px-5 items-center space-x-2 cursor-pointer " +
        "rounded-md hover:shadow-sm hover:border-yellow-200 hover:border hover:bg-yellow-50 " +
        (active
          ? "rounded-md shadow-sm border-yellow-200 border bg-yellow-50"
          : "")
      }
    >
      <div className={"flex justify-center"}>
        <input
          id={"addr_" + value}
          type="radio"
          name="addressId"
          value={value}
        />
      </div>
      <div className={"space-x-2"}>{children}</div>
    </div>
  );
};
