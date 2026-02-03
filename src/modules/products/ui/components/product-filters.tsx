'use client'

import { cn } from '@/lib/utils'
import { useProductFilters } from '@/modules/products/hooks/use-product-filters'
import PriceFilter from '@/modules/products/ui/components/price-filter'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

interface ProductFilterProps {
  title: string
  className?: string
  children: React.ReactNode
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(true)

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon

  return (
    <div className={cn('flex flex-col gap-2 border-b p-4', className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className='flex cursor-pointer items-center justify-between'
      >
        <p className='font-medium'>{title}</p>
        <Icon className='size-5' />
      </div>
      {isOpen && children}
    </div>
  )
}

const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters()

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className='rounded-md border bg-white'>
      <div className='flex items-center justify-between border-b p-4'>
        <p className='font-medium'>Filters</p>
        <button className='underline' onClick={() => {}} type='button'>
          Clear
        </button>
      </div>
      <ProductFilter title='Price' className='border-b-0'>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange('minPrice', value)}
          onMaxPriceChange={(value) => onChange('maxPrice', value)}
        />
      </ProductFilter>
    </div>
  )
}

export default ProductFilters
