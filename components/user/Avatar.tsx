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
    return HSLtoString(generateHSL(id, saturationRange, lightnessRange));
  };

  const getInitials = (user) => {
    return `${user.firstname.first[0]}${user.lastname.last[0]}`
  }

  const userName = `${name}`;
  const color = generateColorHsl(userName, saturationRange, lightnessRange);
  const initials = getInitials(user);
  return (<div className="row">
    <div className={`avatarColor ${theme} bg-${color}`}>{initials}</div>
    <div className="userName">{userName}</div>
  </div>)

}
