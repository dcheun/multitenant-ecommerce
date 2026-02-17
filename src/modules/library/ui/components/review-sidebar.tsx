import ReviewForm from '@/modules/library/ui/components/review-form'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

interface ReviewSidebarProps {
  productId: string
}

const ReviewSidebar = ({ productId }: ReviewSidebarProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.reviews.getOne.queryOptions({ productId }))

  return <ReviewForm productId={productId} initialData={data} />
}

export default ReviewSidebar
