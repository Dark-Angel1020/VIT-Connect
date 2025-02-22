"use client"

import { Label } from "@/components/ui/label"

interface CustomRadioProps {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

export function CustomRadio({ id, label, checked, onChange }: CustomRadioProps) {
  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onChange}>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-white"
        }`}
      >
        {checked && (
          <div
            className="w-3 h-3 rounded-full bg-white animate-scaleIn"
          />
        )}
      </div>
      <Label htmlFor={id} className="text-lg select-none cursor-pointer">
        {label}
      </Label>
    </div>
  )
}
