// import { getQueryClient, trpc } from '@/trpc/server'

// const Home = async () => {
//   const queryClient = getQueryClient()
//   const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions())

//   return <div>{JSON.stringify(categories, null, 2)}</div>
// }

// export default Home

// 'use client'

// import { useTRPC } from '@/trpc/client'
// import { useQuery } from '@tanstack/react-query'

// const Home = () => {
//   const trpc = useTRPC()
//   const categories = useQuery(trpc.categories.getMany.queryOptions())
//   if (!categories.data) return <div>Loading...</div>
//   return <div>{JSON.stringify(categories.data, null, 2)}</div>
// }

// export default Home

// 'use client'

// import { useTRPC } from '@/trpc/client'
// import { useQuery } from '@tanstack/react-query'

// const Home = () => {
//   const trpc = useTRPC()
//   const { data } = useQuery(trpc.auth.session.queryOptions())

//   return <div>{JSON.stringify(data?.user, null, 2)}</div>
// }

// export default Home

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs/server'

import { DEFAULT_LIMIT } from '@/constants'
import { loadProductFilters } from '@/modules/products/search-params'
import ProductListView from '@/modules/products/ui/views/product-list-view'
import { getQueryClient, trpc } from '@/trpc/server'

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    }),
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}

export default Page
