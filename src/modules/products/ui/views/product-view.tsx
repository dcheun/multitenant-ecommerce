'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { CheckIcon, LinkIcon, StarIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import { RichText } from '@payloadcms/richtext-lexical/react'

import StarRating from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, generateTenantURL } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { useState } from 'react'

const CartButton = dynamic(() => import('@/modules/products/ui/components/cart-button'), {
  ssr: false,
  loading: () => (
    <Button disabled className='flex-1 bg-pink-400'>
      Add to cart
    </Button>
  ),
})

interface ProductViewProps {
  productId: string
  tenantSlug: string
}

const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id: productId }))

  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className='px-4 py-10 lg:px-12'>
      <div className='overflow-hidden rounded-sm border bg-white'>
        <div className='relative aspect-[3.9] border-b'>
          <Image
            src={data.image?.url || '/placeholder.png'}
            alt={data.name}
            fill
            className='object-cover'
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-6'>
          <div className='col-span-4'>
            <div className='p-6'>
              <h1 className='text-4xl font-medium'>{data.name}</h1>
            </div>
            <div className='flex border-y'>
              <div className='flex items-center justify-center border-r px-6 py-4'>
                <div className='w-fit border bg-pink-400 px-2 py-1'>
                  <p className='text-base font-medium'>{formatCurrency(data.price)}</p>
                </div>
              </div>

              <div className='flex items-center justify-center px-6 py-4 lg:border-r'>
                <Link href={generateTenantURL(tenantSlug)} className='flex items-center gap-2'>
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className='size-[20px] shrink-0 rounded-full border'
                    />
                  )}
                  <p className='text-base font-medium underline'>{data.tenant.name}</p>
                </Link>
              </div>

              <div className='hidden items-center justify-center px-6 py-4 lg:flex'>
                <div className='flex items-center gap-2'>
                  <StarRating rating={data.reviewRating} iconClassName='size-4' />
                  <p className='text-base font-medium'>{data.reviewCount} ratings</p>
                </div>
              </div>
            </div>

            <div className='block items-center justify-center border-b px-6 py-4 lg:hidden'>
              <div className='flex items-center gap-2'>
                <StarRating rating={data.reviewRating} iconClassName='size-4' />
                <p className='text-base font-medium'>{data.reviewCount} ratings</p>
              </div>
            </div>

            <div className='p-6'>
              {data.description ? (
                <RichText data={data.description} />
              ) : (
                <p className='text-muted-foreground font-medium italic'>No description available</p>
              )}
            </div>
          </div>

          <div className='col-span-2'>
            <div className='h-full border-t lg:border-t-0 lg:border-l'>
              <div className='flex flex-col gap-4 border-b p-6'>
                <div className='flex flex-row items-center gap-2'>
                  <CartButton
                    productId={productId}
                    tenantSlug={tenantSlug}
                    isPurchased={data.isPurchased}
                  />
                  <Button
                    variant='elevated'
                    className='size-12'
                    onClick={() => {
                      setIsCopied(true)
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Link copied to clipboard')
                      setTimeout(() => setIsCopied(false), 1000)
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckIcon /> : <LinkIcon />}
                  </Button>
                </div>

                <p className='text-center font-medium'>
                  {data.refundPolicy === 'no-refunds'
                    ? 'No refunds'
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>

              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <p className='text-xl font-medium'>Ratings</p>
                  <div className='flex items-center gap-x-1 font-medium'>
                    <StarIcon className='size-4 fill-black' />
                    <p>({data.reviewRating})</p>
                    <p className='text-base'>{data.reviewCount} ratings</p>
                  </div>
                </div>

                <div className='mt-4 grid grid-cols-[auto_1fr_auto] gap-3'>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className='font-medium'>
                        {stars} {stars === 1 ? 'star' : 'stars'}
                      </div>
                      <Progress value={data.ratingDistribution[stars]} className='h-[1lh]' />
                      <div className='font-medium'>{data.ratingDistribution[stars]}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductViewSkeleton = () => {
  return (
    <div className='px-4 py-10 lg:px-12'>
      <div className='overflow-hidden rounded-sm border bg-white'>
        <div className='relative aspect-[3.9] border-b'>
          <Image src={'/placeholder.png'} alt='Placeholder' fill className='object-cover' />
        </div>
      </div>
    </div>
  )
}

export default ProductView
