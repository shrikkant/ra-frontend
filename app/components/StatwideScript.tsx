'use client'
import React from 'react'
import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../app-store/auth/auth.slice'

declare global {
  interface Window {
    featurics
    heap
    analytics
    aptrinsic
  }
}
export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)
  // const isAdmin = (user: IUser) => {
  //   return user?.role === 'A';
  // }

  useEffect(() => {
    if (!loggedUser?.id || !window.featurics) {
      return
    }

    window.featurics?.init({
      account: {
        accountName: loggedUser?.city || 'N/A',
        accountProperties: [
          {
            key: 'City',
            value: loggedUser?.city,
          },
        ],
      },
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
          {
            key: 'City',
            value: loggedUser?.city || '',
          },
        ],
      },
    })

    if (window.heap) {
      window.heap?.identify(
        loggedUser.id + '_' + loggedUser.email_address.split('@')[0],
      )
      window.heap?.addUserProperties({
        name: `${loggedUser.firstname} ${loggedUser.lastname}`,
        email: loggedUser.email_address,
        city: loggedUser.city,
      })
    }
  }, [loggedUser])

  return <></>
}
