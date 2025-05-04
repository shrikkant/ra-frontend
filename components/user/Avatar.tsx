import React from 'react'
import {IUser} from '../../app-store/types'

interface AvatarProps {
  user: IUser
  size?: string
}

export function Avatar({user, size = '10'}: AvatarProps) {
  const range = 10
  const saturation = 50
  const lightness = 50

  const getRange = (value, range) => {
    return [Math.max(0, value - range), Math.min(value + range, 100)]
  }

  const saturationRange = getRange(saturation, range)
  const lightnessRange = getRange(lightness, range)

  const getHashOfString = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    hash = Math.abs(hash)
    return hash
  }

  const normalizeHash = (hash, min, max) => {
    return Math.floor((hash % (max - min)) + min)
  }

  const hslToHex = (h, s, l) => {
    // Convert h, s, l to values between 0 and 1
    s /= 100
    l /= 100

    // Calculate chroma, X, and match values
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0,
      g = 0,
      b = 0

    // Determine r, g, b based on hue range
    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }

    // Convert r, g, b to 0-255 range, add m, and round
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    // Convert r, g, b to hex and return the hex color
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
  }

  const generateHSL = (name, saturationRange, lightnessRange) => {
    const hash = getHashOfString(name)
    const h = normalizeHash(hash, 0, 360)
    const s = normalizeHash(hash, saturationRange[0], saturationRange[1])
    const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1])
    return [h, s, l]
  }

  const generateColorHsl = (id, saturationRange, lightnessRange) => {
    const hsl = generateHSL(id, saturationRange, lightnessRange)
    return hslToHex(hsl[0], hsl[1], hsl[2])
  }

  const getInitials = user => {
    return `${user.firstname ? user.firstname[0] : 'A'}${user.lastname ? user.lastname[0] : 'A'}`
  }

  function hexToRgb(hex: string): {r: number; g: number; b: number} {
    // Remove the '#' if it's there
    hex = hex.replace('#', '')

    // Parse the hex string into RGB values
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return {r, g, b}
  }

  function calculateBrightness(r: number, g: number, b: number): number {
    // Apply the brightness formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  function getOptimalTextColor(hex: string): string {
    // Convert the hex code to RGB
    const {r, g, b} = hexToRgb(hex)

    // Calculate brightness
    const brightness = calculateBrightness(r, g, b)

    // If brightness is low, return white text, else black text
    return brightness < 128 ? '#FFFFFF' : '#000000'
  }

  const userName = `${user.firstname} ${user.lastname}`
  const color = generateColorHsl(userName, saturationRange, lightnessRange)
  const initials = getInitials(user)
  return (
    <>
      {user.profile_pic ? (
        <img
          className={` h-${size} w-${size} rounded-full`}
          src={user.profile_pic}
          alt=""
        />
      ) : (
        <div className="flex">
          <div
            style={{backgroundColor: color, color: getOptimalTextColor(color)}}
            className={`w-${size} h-${size} text-xl  text-center rounded-full flex flex-col justify-center font-normal uppercase`}
          >
            {initials}
          </div>
        </div>
      )}
    </>
  )
}
