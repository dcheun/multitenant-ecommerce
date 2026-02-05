'use client'

import { cn } from '@/lib/utils'
import { useProductFilters } from '@/modules/products/hooks/use-product-filters'
import PriceFilter from '@/modules/products/ui/components/price-filter'
import TagsFilter from '@/modules/products/ui/components/tags-filter'
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

  const onClear = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      tags: [],
    })
  }

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sort') {
      return false
    }

    if (Array.isArray(value)) {
      return value.length > 0
    }

    if (typeof value === 'string') {
      return value !== ''
    }

    return value != null
  })

  return (
    <div className='rounded-md border bg-white'>
      <div className='flex items-center justify-between border-b p-4'>
        <p className='font-medium'>Filters</p>
        {hasAnyFilters && (
          <button className='cursor-pointer underline' onClick={onClear} type='button'>
            Clear
          </button>
        )}
      </div>
      <ProductFilter title='Price'>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange('minPrice', value)}
          onMaxPriceChange={(value) => onChange('maxPrice', value)}
        />
      </ProductFilter>
      <ProductFilter title='Tags' className='border-b-0'>
        <TagsFilter value={filters.tags} onChange={(value) => onChange('tags', value)} />
      </ProductFilter>
    </div>
  )
}

export default ProductFilters
