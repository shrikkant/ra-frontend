"use client"
import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from '../../app-store/auth/auth.slice'
import { IUser } from '../../app-store/types'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featurics: any
  }
}
export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)
  const isAdmin = (user: IUser) => {
    return user?.role === 'A';
  }

  useEffect(() => {

    if (!loggedUser?.id || !window.featurics) {
      return;
    }

    window.featurics &&
      window.featurics.init({
        visitor: {
          appVisitorId: loggedUser?.id,
          email: loggedUser?.email_address,
          firstName: loggedUser?.firstname || 'User ' + loggedUser?.id,
          lastName: loggedUser?.lastname || '',
          // You can include additional visitor level key-values here,
          // as long as it's not one of the above reserved names.
          visitorProperties: [
            {
              key: 'OrganizationId',
              value: loggedUser?.id,
            },
          ],
        },
      })
  }, [loggedUser, window.featurics])

  return (<>
  </>)
}
