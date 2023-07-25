import {
  ArrowDownOnSquareIcon,
  ArrowLeftCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function NavMenu({ items, onClick }) {
  const handleMenuItemClick = (item) => {
    console.log("Clicked! ", item);
    onClick(item)
  };
  return (
    <>
      <nav>
        <ul>
          <li>
            <ul className="menu">
              {items
                .filter((it) => !it.children)
                .map((child) => (
                  <li key={child.key}>
                    <a
                      className={child.active? "active" : ""}
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
          {items.filter(it => !!it.children).map((item) => {
            return (
              <li key={item.key}>
                <ul className="menu">
                  {item?.children?.map((child) => (
                    <li key={child.key}>
                      <a
                        className={child.active ? "active" : ""}
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
            );
          })}
        </ul>
      </nav>
    </>
  );
}
