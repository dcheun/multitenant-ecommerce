import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

import ProductView, { ProductViewSkeleton } from '@/modules/library/ui/views/product-view'
import { getQueryClient, trpc } from '@/trpc/server'

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({ productId }))
  void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({ productId }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default ProductPage
