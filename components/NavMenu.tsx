import {
  ArrowDownOnSquareIcon,
  ArrowLeftCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function NavMenu({ items, onClick }) {
  const handleMenuItemClick = (item) => {
    onClick(item);
  };
  return (
    <>
      <nav>
        <ul className="flex flex-col flex-1 gap-y-7">
          <li>
            <ul className="menu">
              {items
                .filter((it) => !it.children)
                .map((child) => (
                  <li key={child.key} className="flex">
                    <a
                      className={
                        (child.active? "bg-gray-800 text-slate-50 " : "") +
                        "hover:bg-gray-800 hover:text-slate-50 p-2 rounded-md tex-sm font-semibold text-gray-400 flex col-gapo gap-x-3 content-center  w-full"
                      }
                      onClick={() => handleMenuItemClick(child)}
                      href="#"
                    >
                      {child?.icon}
                      {child.label}
                    </a>
                  </li>
                ))}
            </ul>
          </li>
          {items
            .filter((it) => !!it.children)
            .map((item) => {
              return (
                <li key={item.key}>
                  <ul className="menu">
                    {item?.children?.map((child) => (
                      <li key={child.key} className="flex my-2">
                        <a
                          className={
                            (child.active? "bg-gray-800 text-slate-50 " : "") +
                            "hover:bg-gray-800 hover:text-slate-50 p-2 rounded-md tex-sm font-semibold text-gray-400 flex col-gapo gap-x-3 content-center  w-full"
                          }
                          onClick={() => handleMenuItemClick(child)}
                          href="#"
                        >
                          {child?.icon}
                          {<div>{child.label}</div>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
        </ul>
      </nav>
    </>
  );
}
