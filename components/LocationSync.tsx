'use client'

import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getDefaultSearch, setSearch} from '../app-store/session/session.slice'

interface LocationSyncProps {
  city: string
}

export const LocationSync: React.FC<LocationSyncProps> = ({city}) => {
  const dispatch = useDispatch()
  const stateSearch = useSelector(getDefaultSearch)

  useEffect(() => {
    // Normalize city names for comparison
    const normalizeCity = (cityName: string) => {
      const normalized = cityName.toLowerCase().trim()
      // Handle special cases
      if (normalized === 'bangalore') return 'bengaluru'
      if (normalized === 'bengaluru') return 'bengaluru'
      // Capitalize first letter for standard format
      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    }

    const urlCity = normalizeCity(city)
    const currentCity = stateSearch?.location?.city
      ? normalizeCity(stateSearch.location.city)
      : null

    // Only update if cities are different or no city is set
    if (!currentCity || currentCity !== urlCity) {
      const updatedSearch = {
        ...stateSearch,
        location: {
          city: urlCity,
        },
      }
      dispatch(setSearch(updatedSearch))
    }
  }, [city, dispatch, stateSearch]) // Include all dependencies

  // This component doesn't render anything
  return null
}