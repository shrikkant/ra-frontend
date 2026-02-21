import React from 'react'
import {ORDER_STEPS} from 'config/constants'

const STEPS = [
  {label: 'Address', num: 1},
  {label: 'Review', num: 2},
  {label: 'Payment', num: 3},
]

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

function stepToActiveNum(orderStep: number): number {
  if (orderStep === ORDER_STEPS.ORDER_STEP_ADDRESS) return 1
  if (orderStep === ORDER_STEPS.ORDER_STEP_DELIVERY) return 2
  return 3
}

function StepCircle({num, isCompleted, isActive}: {num: number; isCompleted: boolean; isActive: boolean}) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0'
  const variant = isCompleted
    ? 'bg-amber-400 text-white'
    : isActive
      ? 'ring-2 ring-amber-400 text-amber-600 bg-amber-50'
      : 'bg-gray-100 text-gray-400'

  return (
    <div className={`${base} ${variant}`}>
      {isCompleted ? <CheckIcon /> : num}
    </div>
  )
}

function Connector({done}: {done: boolean}) {
  return <div className={`w-10 h-0.5 ${done ? 'bg-amber-400' : 'bg-gray-200'}`} />
}

export function StepProgressBar({currentStep}: {currentStep: number}) {
  const activeNum = stepToActiveNum(currentStep)

  return (
    <div className="flex items-start justify-center gap-0 py-3">
      {STEPS.map((step, i) => {
        const isCompleted = step.num < activeNum
        const isActive = step.num === activeNum
        return (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center w-16">
              <StepCircle num={step.num} isCompleted={isCompleted} isActive={isActive} />
              <span
                className={`text-[11px] mt-1 font-medium ${
                  isCompleted || isActive ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center h-8">
                <Connector done={step.num < activeNum} />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
