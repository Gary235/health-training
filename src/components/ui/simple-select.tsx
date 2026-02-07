import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface SimpleSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onValueChange?: (value: string) => void
  onChange?: (e: { target: { value: string } }) => void
  placeholder?: string
  disabled?: boolean
  children?: React.ReactNode
}

/**
 * SimpleSelect - A wrapper around shadcn Select that accepts <option> children
 * for easier migration from native select elements.
 *
 * Usage:
 * <SimpleSelect value={value} onValueChange={setValue}>
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </SimpleSelect>
 */
const SimpleSelect = React.forwardRef<HTMLDivElement, SimpleSelectProps>(
  ({ value, onValueChange, onChange, placeholder, disabled, children, className, ...props }, ref) => {
    // Handle both onValueChange and legacy onChange
    const handleValueChange = React.useCallback((newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue)
      }
      if (onChange) {
        onChange({ target: { value: newValue } })
      }
    }, [onValueChange, onChange])
    // Extract options from children
    const options = React.useMemo(() => {
      const opts: { value: string; label: string }[] = []

      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const props = child.props as any
          opts.push({
            value: props.value || '',
            label: props.children || props.value || '',
          })
        }
      })

      return opts
    }, [children])

    return (
      <div ref={ref} className={className} {...props}>
        <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
)
SimpleSelect.displayName = "SimpleSelect"

export { SimpleSelect }
