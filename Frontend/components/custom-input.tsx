"use client"

import { Input } from "@/components/ui/input"
import type React from "react"

interface CustomInputProps {
  id: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  pattern: string
  isRegId?: boolean
}

export function CustomInput({ id, placeholder, value, onChange, pattern, isRegId }: CustomInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (isRegId) {
      newValue = newValue.toUpperCase()
    }
    onChange(newValue)
  }

  return (
    <div className="transition-opacity opacity-100">
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        pattern={pattern}
        className={`border-2 border-gray-250 focus:border-primary transition-colors duration-300 text-xl py-8 px-4 ${
          isRegId ? "text-2xl h-16" : "h-16"
        }`}
      />
    </div>
  )
}
