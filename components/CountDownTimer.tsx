import React, {useEffect, useState} from 'react'

interface CountdownTimerProps {
  seconds: number
  onTimeUp: () => void
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({seconds, onTimeUp}) => {
  const [timeLeft, setTimeLeft] = useState<number>(seconds)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)

    // Cleanup the interval on component unmount or when timeLeft changes
    return () => clearInterval(intervalId)
  }, [timeLeft])

  return (
    <div className="w-full text-center p-4 text-3xl">
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}

export default CountdownTimer
