'use client'

import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {authUser, selectAuthState} from '../app-store/auth/auth.slice'
import {getAuthUser} from '../api/auth.api'

// Hydrates redux auth from the backend session cookie when redux has no user.
// Lives at the root so it runs on every route — including the redesigned
// routes that suppress the legacy <Header>/<TopNavMenu>. Without this, OAuth
// flows (Google) that land back on '/' or '/join' never repopulate redux,
// and the user appears logged out on refresh.
export default function AuthBootstrap() {
  const dispatch = useDispatch()
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    if (loggedUser) return
    getAuthUser()
      .then(u => {
        if (u) dispatch(authUser(u))
      })
      .catch(() => {})
  }, [loggedUser, dispatch])

  return null
}
