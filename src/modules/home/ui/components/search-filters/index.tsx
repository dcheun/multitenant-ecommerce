'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { DEFAULT_BG_COLOR } from '@/modules/constants'
import Categories from '@/modules/home/ui/components/search-filters/categories'
import SearchInput from '@/modules/home/ui/components/search-filters/search-input'
import { useTRPC } from '@/trpc/client'
import BreadcrumbNavigation from '@/modules/home/ui/components/search-filters/breadcrumb-navigation'

const SearchFilters = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
  
  const params = useParams()
  const categoryParam = params.category as string | undefined
  const activeCategory = categoryParam || 'all'
  
  const activeCategoryData = data.find((category) => category.slug === activeCategory)
  
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR
  const activeCategoryName = activeCategoryData?.name || null

  const activeSubcategory = params.subcategory as string | undefined
  const activeSubcategoryName = activeCategoryData?.subcategories?.find((sub) => sub.slug === activeSubcategory)?.name || null
  
  return (
    <div
      className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'
      style={{
        backgroundColor: activeCategoryColor
      }}
    >
      <SearchInput />
      <div className='hidden lg:block'>
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  )
}

export default SearchFilters

export const SearchFiltersLoading = () => {
  return (
    <div
      className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'
      style={{
        backgroundColor: '#F5F5F5',
      }}
    >
      <SearchInput disabled />
      <div className='hidden lg:block'>
        <div className='h-11' />
      </div>
    </div>
  )
}
