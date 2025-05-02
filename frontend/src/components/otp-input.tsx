import React, { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export default function OTPInput({ value, onChange, length = 6, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split("").concat(Array(length - value.length).fill("")))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    if (value !== otp.join("")) {
      setOtp(value.split("").concat(Array(length - value.length).fill("")))
    }
  }, [value, length, otp])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value
    if (newValue.length > 1 || (newValue && !/^\d+$/.test(newValue))) return

    const newOtp = [...otp]
    newOtp[index] = newValue
    setOtp(newOtp)
    onChange(newOtp.join(""))

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (!/^\d+$/.test(pastedData)) return

    const pastedOtp = pastedData.slice(0, length).split("")
    const newOtp = [...pastedOtp, ...Array(length - pastedOtp.length).fill("")]
    setOtp(newOtp)
    onChange(newOtp.join(""))

    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-lg font-medium"
          disabled={disabled}
        />
      ))}
    </div>
  )
}
