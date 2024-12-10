import React from "react";
import { Menu } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, logout } from "../app-store/auth/auth.slice";
import { logoutUser } from "api/auth.api";
import { useRouter } from "next/navigation";
import SignIn from "./user/SignIn";
import { Avatar } from "./user/Avatar";

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
      <div className="flex justify-center align-center ">
        {loggedUser ? (
          <>
            <Menu.Button className="px-0 rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 profileref">
              <span className="sr-only">Open user menu</span>
              <Avatar user={loggedUser}></Avatar>
            </Menu.Button>
            <Menu.Items className="absolute truncate top-full right-0 mt-2 w-auto bg-white border rounded-md shadow-lg z-50 p-3">
              <Menu.Item>
                <button
                  className="block w-full text-left px-2 py-1 text-gray-800 bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu.Items>
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
