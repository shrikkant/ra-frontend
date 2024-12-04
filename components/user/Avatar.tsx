import React from "react";
import { IUser } from "../../app-store/types";

export function Avatar({ user }: { user: IUser }) {

  const [range, setRange] = React.useState(10);
  const [saturation, setSaturation] = React.useState(50);
  const [lightness, setLightness] = React.useState(50);
  const [theme, setTheme] = React.useState('Light');


  const getRange = (value, range) => {
    return [Math.max(0, value - range), Math.min(value + range, 100)];
  }

  const saturationRange = getRange(saturation, range);
  const lightnessRange = getRange(lightness, range);

  const getHashOfString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
  };

  const normalizeHash = (hash, min, max) => {
    return Math.floor((hash % (max - min)) + min);
  };

  const hslToHex = (h, s, l) => {
    // Convert h, s, l to values between 0 and 1
    s /= 100;
    l /= 100;

    // Calculate chroma, X, and match values
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    // Determine r, g, b based on hue range
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    // Convert r, g, b to 0-255 range, add m, and round
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // Convert r, g, b to hex and return the hex color
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  const generateHSL = (name, saturationRange, lightnessRange) => {
    const hash = getHashOfString(name);
    const h = normalizeHash(hash, 0, 360);
    const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
    const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
    return [h, s, l];
  };

  const HSLtoString = (hsl) => {
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  };

  const generateColorHsl = (id, saturationRange, lightnessRange) => {
    const hsl = generateHSL(id, saturationRange, lightnessRange);
    return hslToHex(hsl[0], hsl[1], hsl[2]);
  };

  const getInitials = (user) => {
    return `${user.firstname ? user.firstname[0] : "A"}${user.lastname ? user.lastname[0] : "A"}`;
  }

  const userName = `${user.firstname} ${user.lastname}`;
  const color = generateColorHsl(userName, saturationRange, lightnessRange);
  const initials = getInitials(user);
  return (<div className="flex">
    <div style={{ backgroundColor: color }} className={`w-12 h-12  text-center rounded-full flex flex-col justify-center font-semibold`}>
      {initials}
    </div>
  </div>)

}
