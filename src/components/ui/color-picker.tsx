import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

const presetColors = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
  '#64748b', // slate
  '#6b7280', // gray
  '#000000', // black
]

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    onChange(color)
  }

  const isValidHex = (color: string) => {
    return HEX_COLOR_REGEX.test(color)
  }

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-10 w-16 p-0"
          disabled={disabled}
          style={{ backgroundColor: isValidHex(value) ? value : '#000000' }}
          title="Selecionar cor"
          type="button"
          variant="outline"
        >
          <span className="sr-only">Selecionar cor</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <label
              className="mb-2 block font-medium text-sm"
              htmlFor="custom-color"
            >
              Cor personalizada
            </label>
            <div className="flex gap-2">
              <Input
                className="flex-1 font-mono"
                id="custom-color"
                onChange={(e) => {
                  const newValue = e.target.value
                  if (newValue.startsWith('#')) {
                    onChange(newValue)
                  } else {
                    onChange(`#${newValue}`)
                  }
                }}
                placeholder="#3b82f6"
                value={value}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 block font-medium text-sm">Cores predefinidas</p>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  className="h-10 w-10 rounded-md border-2 transition-all hover:scale-110"
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    backgroundColor: color,
                    borderColor: value === color ? '#000' : 'transparent',
                  }}
                  title={color}
                  type="button"
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
