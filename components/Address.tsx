export const Address = ({ name, address }) => {
  return (
    <div className={"text-base font-normal flex flex-col"}>
      <div>{name}</div>
      {address.id && <div>
        <span>{address.address_line_1},</span>
        <span>
          {address.address_line_2}, {address.city}
        </span>
        <span>{address.state},</span>
        <span>{address.postal_code}</span>
      </div>}
      {!address.id && <div className={"font-semibold"}>Store Pickup</div>}
    </div>
  );
};
