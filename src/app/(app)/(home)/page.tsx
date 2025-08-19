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

const Home = () => {
  return <div>Home</div>
}

export default Home
