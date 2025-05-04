import React from 'react'

export default function LocationShort({location}: {location}) {
  return <div className="r-comp">{location?.city}</div>
}
