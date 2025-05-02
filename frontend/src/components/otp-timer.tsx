import { useState, useEffect } from "react"

interface OTPTimerProps {
  seconds: number
  onTimerComplete: () => void
  isActive: boolean
}

export default function OTPTimer({ seconds, onTimerComplete, isActive }: OTPTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(seconds)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          onTimerComplete()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, seconds, onTimerComplete])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isActive) return null

  return (
    <div className="text-sm text-muted-foreground">
      Request new code in <span className="font-medium">{formatTime(timeLeft)}</span>
    </div>
  )
}
