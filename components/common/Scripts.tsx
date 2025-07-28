'use client'
import React, {useEffect, useState} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useDispatch, useSelector} from 'react-redux'
import {
  getLastLink,
  getUTMData,
  setLastLink,
  setUTMData,
} from '../../app-store/session/session.slice'
import {selectAuthState} from '../../app-store/auth/auth.slice'
import {StatwideScript} from '../../app/components/StatwideScript'
import {isVerified, VERIFICATION_FLAGS} from '../../config/constants'
import {extractUTMParams} from '../../util/utm.util'
import {UtmData} from '../../app-store/types'
import httpClient from '../../api/axios.config'

export default function Scripts() {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const lastLink = useSelector(getLastLink)
  const loggedUser = useSelector(selectAuthState)
  const searchParams = useSearchParams()
  const utmData = useSelector(getUTMData)

  // Set UTM data as HTTP-only cookie if present

  // if (utmParams) {
  //   console.log('UTM params', utmParams)
  //   httpClient.post(`/utm`, utmParams)
  // }

  useEffect(() => {
    if (searchParams) {
      const searchParamsObj: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        searchParamsObj[key] = value
      })
      const utmParams: UtmData | null = extractUTMParams(searchParamsObj)
      if (utmParams) {
        dispatch(setUTMData(utmParams))
      }
    }

    const link = lastLink
    if (
      loggedUser &&
      isVerified(loggedUser.verified, VERIFICATION_FLAGS.PHONE)
    ) {
      if (link === pathname) {
        dispatch(setLastLink(''))
      }
      if (link && link.length > 0) {
        router.push(link)
        return
      }
    }

    document.body.classList.add('animated-page')
    document.body.classList.add('page-loaded')
  }, [lastLink, loggedUser, pathname, searchParams])

  return (
    <>
      <StatwideScript />
    </>
  )
}
