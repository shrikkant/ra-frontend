'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {FaChartLine} from 'react-icons/fa'
import {
  DailySignupPoint,
  fetchDailySignupStats,
} from '../../api/admin/index.api'

const ALL_CITIES = '__ALL__'

const COLOR_SIGNUPS = '#2563eb'
const COLOR_ENGAGED = '#7c3aed'
const COLOR_CONVERSION = '#16a34a'

const formatTick = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
}

interface ChartPoint extends DailySignupPoint {
  engaged: number
  conversion: number
}

export default function DailySignupsChart() {
  const [series, setSeries] = useState<DailySignupPoint[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [city, setCity] = useState<string>(ALL_CITIES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        const data = await fetchDailySignupStats(
          city === ALL_CITIES ? undefined : city,
        )
        if (cancelled) return
        setSeries(data.series || [])
        setCities(data.cities || [])
      } catch (err) {
        console.error('Error fetching daily signup stats:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [city])

  const chartData: ChartPoint[] = useMemo(
    () =>
      series.map(p => {
        const engaged = p.signups + p.add_to_cart
        const conversion =
          engaged > 0 ? Number(((p.signups / engaged) * 100).toFixed(1)) : 0
        return {...p, engaged, conversion}
      }),
    [series],
  )

  const totals = useMemo(() => {
    const totalSignups = series.reduce((s, p) => s + p.signups, 0)
    const totalCart = series.reduce((s, p) => s + p.add_to_cart, 0)
    const totalEngaged = totalSignups + totalCart
    const overallConversion =
      totalEngaged > 0 ? (totalSignups / totalEngaged) * 100 : 0
    const half = Math.floor(series.length / 2)
    const recent = series.slice(half).reduce((s, p) => s + p.signups, 0)
    const prior = series.slice(0, half).reduce((s, p) => s + p.signups, 0)
    const trend =
      prior > 0 ? Math.round((recent / prior - 1) * 100) : recent > 0 ? 100 : 0
    return {totalSignups, totalCart, totalEngaged, overallConversion, trend}
  }, [series])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FaChartLine className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Daily Signups
            </h3>
            <p className="text-xs text-gray-500">
              Last 30 days
              {city !== ALL_CITIES ? ` · ${city}` : ' · All cities'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Signups
            </div>
            <div className="text-2xl font-bold text-gray-900 leading-tight">
              {totals.totalSignups}
              {totals.trend !== 0 && (
                <span
                  className={`ml-2 text-xs font-semibold ${
                    totals.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {totals.trend > 0 ? '↑' : '↓'} {Math.abs(totals.trend)}%
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Engaged
            </div>
            <div className="text-2xl font-bold text-gray-900 leading-tight">
              {totals.totalEngaged}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Conv. Rate
            </div>
            <div className="text-2xl font-bold text-green-700 leading-tight">
              {totals.overallConversion.toFixed(1)}%
            </div>
          </div>

          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={ALL_CITIES}>All cities</option>
            {cities.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
            No data for this selection
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={chartData}
              margin={{top: 10, right: 16, left: 0, bottom: 0}}
            >
              <defs>
                <linearGradient id="signupsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SIGNUPS} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLOR_SIGNUPS} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                tick={{fontSize: 11, fill: '#64748b'}}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                yAxisId="left"
                allowDecimals={false}
                tick={{fontSize: 11, fill: '#64748b'}}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{fontSize: 11, fill: COLOR_CONVERSION}}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelFormatter={(label: string) =>
                  new Date(label).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                }
                formatter={(value: number, name: string) => {
                  if (name === 'Conversion') return [`${value}%`, name]
                  return [value, name]
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{fontSize: 12, paddingTop: 8}}
              />
              <Area
                yAxisId="left"
                type="monotone"
                name="Signups"
                dataKey="signups"
                stroke={COLOR_SIGNUPS}
                strokeWidth={2}
                fill="url(#signupsFill)"
                dot={false}
                activeDot={{r: 4, strokeWidth: 2, stroke: '#fff'}}
              />
              <Line
                yAxisId="left"
                type="monotone"
                name="Engaged"
                dataKey="engaged"
                stroke={COLOR_ENGAGED}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{r: 4, strokeWidth: 2, stroke: '#fff'}}
              />
              <Line
                yAxisId="right"
                type="monotone"
                name="Conversion"
                dataKey="conversion"
                stroke={COLOR_CONVERSION}
                strokeWidth={2}
                dot={false}
                activeDot={{r: 4, strokeWidth: 2, stroke: '#fff'}}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
