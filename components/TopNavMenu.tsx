'use client'
import React, {Fragment, useEffect} from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import {useDispatch, useSelector} from 'react-redux'
import {logout, authUser, selectAuthState} from '../app-store/auth/auth.slice'
import {getAuthUser, logoutUser} from 'api/auth.api'
import {useRouter} from 'next/navigation'
import SignIn from './user/SignIn'
import {Avatar} from './user/Avatar'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Link from 'next/link'
import {IoMdLogOut} from 'react-icons/io'

import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon'
import {FaShopify} from 'react-icons/fa'
import {IUser} from '../app-store/types'
import {useSearchParams} from 'next/navigation'
import {ChartBarIcon} from '@heroicons/react/24/outline'
import SignupButton from './common/SignupButton'

interface INavLink {
  title: string
  path: string
  icon: React.ReactNode
}

export default function TopNavMenu() {
  const searchParams = useSearchParams()
  const loggedUser = useSelector(selectAuthState)
  const dispatch = useDispatch()
  const router = useRouter()
  const signUp = searchParams?.get('signUp') || false
  const [showSignIn, setShowSignIn] = React.useState(signUp)

  const isAdmin = (user: IUser) => {
    return user?.role === 'A'
  }
  const userLinks: INavLink[] = [
    {
      title: 'My Profile',
      path: '/p/profile',
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      title: 'My Orders',
      path: '/p/orders',
      icon: (
        <ShoppingBagIcon className="h-6 w-6 text-gray-600 hover:text-amber-500 transition-colors" />
      ),
    },
  ]

  const adminLinks: INavLink[] = [
    {
      title: 'Customers',
      path: '/p/admin/customers',
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      title: 'Orders',
      path: '/p/admin/orders',
      icon: (
        <ShoppingBagIcon className="h-6 w-6 text-gray-600 hover:text-amber-500 transition-colors" />
      ),
    },
    {
      title: 'Brands',
      path: '/p/admin/brands',
      icon: <ShoppingBagIcon className="h-6 w-6" />,
    },

    {
      title: 'Products',
      path: '/p/admin/products',
      icon: <FaShopify className="h-6 w-6" />,
    },
    {
      title: 'Inventory',
      path: '/p/admin/inventory',
      icon: <FaShopify className="h-6 w-6" />,
    },
    {
      title: 'Listing',
      path: '/p/admin/listing',
      icon: <FaShopify className="h-6 w-6" />,
    },
    {
      title: 'Analytics',
      path: '/p/admin/analytics',
      icon: <ChartBarIcon className="h-6 w-6" />,
    },
  ]

  useEffect(() => {
    if (!loggedUser) {
      getAuthUser().then(u => {
        dispatch(authUser(u))
      })
    }
  }, [loggedUser])

  const handleLogout = async () => {
    logoutUser().then(() => {
      dispatch(logout())
      router.push('/')
    })
  }

  const showSignInModal = () => {
    setShowSignIn(true)
  }

  const closeSignInModal = () => {
    setShowSignIn(false)
  }

  return (
    <>
      {
        <Menu as="div" className="relative">
          <div className="flex justify-center align-center w-22">
            {loggedUser ? (
              <>
                <MenuButton className="p-0">
                  <Avatar user={loggedUser} size="8"></Avatar>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="mt-2 absolute truncate top-full right-0 w-48 bg-white border rounded-md shadow-lg z-50">
                    {userLinks.map((link, index) => (
                      <MenuItem key={index}>
                        <Link
                          href={link.path}
                          className="flex gap-x-2 w-full text-left px-4 py-3 text-gray-800 bg-gray-100"
                        >
                          {link.icon}
                          <span>{link.title}</span>
                        </Link>
                      </MenuItem>
                    ))}

                    <div className="border-t border-gray-300"></div>
                    {isAdmin(loggedUser) &&
                      adminLinks.map((link, index) => (
                        <MenuItem key={index}>
                          <Link
                            href={link.path}
                            className="flex gap-x-2 w-full text-left px-4 py-3 text-gray-800 bg-gray-100"
                          >
                            {link.icon}
                            <span>{link.title}</span>
                          </Link>
                        </MenuItem>
                      ))}

                    <div className="border-t border-gray-300"></div>
                    <MenuItem>
                      <Link
                        href="#"
                        className="flex w-full text-left px-4 py-2 gap-x-2 text-gray-800 bg-gray-100"
                        onClick={handleLogout}
                      >
                        <IoMdLogOut className="h-6 w-6" />
                        <span>Logout</span>
                      </Link>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </>
            ) : (
              <SignupButton onClick={showSignInModal} />
            )}
            {showSignIn && <SignIn onClose={closeSignInModal}></SignIn>}
          </div>
        </Menu>
      }
    </>
  )
}
