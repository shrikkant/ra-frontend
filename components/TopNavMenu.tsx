import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, logout } from "../app-store/auth/auth.slice";
import { logoutUser } from "api/auth.api";
import { useRouter } from "next/navigation";
import SignIn from "./user/SignIn";
import { Avatar } from "./user/Avatar";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Link from "next/link";
import { IoMdLogOut } from "react-icons/io";
import { Divider } from "antd";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";

export default function TopNavMenu() {
  const loggedUser = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showSignIn, setShowSignIn] = React.useState(false);

  const handleLogout = async () => {
    logoutUser().then(() => {
      dispatch(logout());
      router.push("/");
    })
  };

  const showSignInModal = () => {
    setShowSignIn(true);
  }

  const closeSignInModal = () => {
    setShowSignIn(false);
  }

  return (
    <Menu as="div" className="relative">
      <div className="flex justify-center align-center w-22">
        {loggedUser ? (
          <>
            <Menu.Button className="p-0 rounded-full bg-gray-800 text-sm focus:outline-none  focus:ring-white focus:ring-offset-gray-800 profileref">
              <Avatar user={loggedUser}></Avatar>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="mt-2 absolute truncate top-full right-0 w-48 bg-white border rounded-md shadow-lg z-50">

                <Menu.Item>
                  <Link href="/portal/profile"
                    className="flex gap-x-2 w-full text-left px-4 py-3 text-gray-800 bg-gray-100">
                    <UserIcon className="h-6 w-6" />
                    <span>My Profile</span>
                  </Link>
                </Menu.Item>


                <Menu.Item>
                  <Link href="/portal/orders"
                    className="flex gap-x-2 w-full text-left px-4 py-3 text-gray-800 bg-gray-100">
                    <ShoppingBagIcon className="h-6 w-6" />
                    <span>My Orders</span>
                  </Link>
                </Menu.Item>

                <div className="border-t border-gray-300"></div>
                <Menu.Item>
                  <Link
                    href="#"
                    className="flex w-full text-left px-4 py-2 gap-x-2 text-gray-800 bg-gray-100"
                    onClick={handleLogout}
                  >
                    <IoMdLogOut className="h-6 w-6" />
                    <span>Logout</span>
                  </Link>
                </Menu.Item>

              </Menu.Items>
            </Transition>
          </>
        ) : (
          <a
            href="#"
            onClick={showSignInModal}
            className=" bg-gray-800 p-1 text-gray-300 font-semibold hover:text-white focus:outline-none focus:ring-offset-gray-800 cursor-pointer"
          >
            <span className="sr-only">Sign up</span>
            Sign up
          </a>
        )}
        {showSignIn && <SignIn onClose={closeSignInModal}></SignIn>}
      </div>
    </Menu>
  );
}
