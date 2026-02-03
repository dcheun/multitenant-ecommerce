import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangeEvent } from 'react'

interface PriceFilterProps {
  minPrice?: string | null
  maxPrice?: string | null
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, '')

  const parts = numericValue.split('.')
  const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1]?.slice(0, 2) : '')

  if (!formattedValue) return ''

  const numberValue = parseFloat(formattedValue)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue)
}

const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value and extract only numeric values
    const value = e.target.value
    const numericValue = value.replace(/[^0-9.]/g, '')
    onMinPriceChange(numericValue)
  }

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = value.replace(/[^0-9.]/g, '')
    onMaxPriceChange(numericValue)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Minimun Price</Label>
        <Input
          type='text'
          placeholder='$0'
          value={minPrice ? formatAsCurrency(minPrice) : ''}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label className='text-base font-medium'>Maximum Price</Label>
        <Input
          type='text'
          placeholder='∞'
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  )
}

export default PriceFilter
