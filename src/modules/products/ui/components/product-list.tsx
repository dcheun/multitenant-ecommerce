'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { InboxIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DEFAULT_LIMIT } from '@/constants'
import { useProductFilters } from '@/modules/products/hooks/use-product-filters'
import ProductCard, { ProductCardSkeleton } from '@/modules/products/ui/components/product-card'
import { useTRPC } from '@/trpc/client'

interface ProductListProps {
  category?: string
}

const ProductList = ({ category }: ProductListProps) => {
  const [filters] = useProductFilters()

  const trpc = useTRPC()
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { ...filters, category, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
        },
      },
    ),
  )

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8'>
        <InboxIcon />
        <p className='text-base font-medium'>No products found</p>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              authorUsername='antonio'
              authorImageUrl={undefined}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          ))}
      </div>
      <div className='flex justify-center pt-8'>
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className='bg-white text-base font-medium disabled:opacity-50'
            variant='elevated'
          >
            Load more
          </Button>
        )}
      </div>
    </>
  )
}

export const ProductListSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductList
