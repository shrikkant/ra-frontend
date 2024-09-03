"use client"
import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthState } from '../../app-store/auth/auth.slice'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featurics: any
  }
}
export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    // if (import.meta.env.VITE_ENABLE_STATWIDE != 'true') {
    //   return
    // }
    if (!loggedUser?.id || !window.featurics) {
      console.log('statwide not Initialized u:', loggedUser)
      return
    }
    console.log('statwide Initialized : ', loggedUser.email_address);

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
