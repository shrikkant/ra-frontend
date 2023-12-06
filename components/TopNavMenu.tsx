import { Menu } from "@headlessui/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../app-store/auth/auth.slice";

export default function TopNavMenu() {
  const loggedUser = useSelector(selectAuthState);

  return (
    <Menu as="div" className="relative">
      <div>
        {loggedUser ? (
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <img
              className=" h-8 w-8 rounded-full"
              src={loggedUser.profile_pic}
              alt=""
            />
          </Menu.Button>
        ) : (
          <a
            href="/signin"
            className=" bg-gray-800 p-1 text-gray-300 font-semibold hover:text-white focus:outline-none focus:ring-offset-gray-800 cursor-pointer"
          >
            <span className="sr-only">Log in</span>
            Log in
          </a>
        )}
      </div>
    </Menu>
  );
}
