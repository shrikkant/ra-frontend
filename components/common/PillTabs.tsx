'use client'

import React from 'react'
import {Tab, TabList} from '@headlessui/react'

interface PillTabListProps {
  tabs: string[]
}

export const pillTabClassName = ({selected}: {selected: boolean}) =>
  `px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
    selected
      ? 'bg-white text-amber-700 shadow-sm'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  }`

export const pillTabListClassName = 'flex gap-1 bg-gray-100 p-1 rounded-lg w-fit'

/**
 * Reusable pill-style tab list component with grouped button appearance.
 * Use inside a HeadlessUI TabGroup.
 */
export const PillTabList: React.FC<PillTabListProps> = ({tabs}) => (
  <TabList className={pillTabListClassName}>
    {tabs.map(tab => (
      <Tab key={tab} className={pillTabClassName}>
        {tab}
      </Tab>
    ))}
  </TabList>
)
