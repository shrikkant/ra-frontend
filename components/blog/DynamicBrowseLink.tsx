'use client'
import React from 'react'
import Link from 'next/link'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../app-store/session/session.slice'
import {locationCity} from '../../util/search.util'

interface DynamicBrowseLinkProps {
  className?: string
  children: React.ReactNode
}

const DynamicBrowseLink: React.FC<DynamicBrowseLinkProps> = ({
  className,
  children,
}) => {
  const stateSearch = useSelector(getDefaultSearch)
  const currentCity = stateSearch?.location?.city || 'Pune'
  const currentCategory = 'rent-camera'

  return (
    <Link
      href={`/${locationCity(currentCity, true)}/${currentCategory}?q=`}
      className={className}
    >
      {children}
    </Link>
  )
}

export default DynamicBrowseLink