'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { generateTenantURL } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'

const CheckoutButton = dynamic(() => import('@/modules/checkout/ui/components/checkout-button'), {
  ssr: false,
  loading: () => (
    <Button variant='elevated' disabled className='bg-white'>
      <ShoppingCartIcon />
    </Button>
  ),
})

interface NavbarProps {
  slug: string
}

const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }))

  return (
    <nav className='h-20 border-b bg-white font-medium'>
      <div className='mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12'>
        <Link href={generateTenantURL(slug)} className='flex items-center gap-2'>
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className='size-[32px] shrink-0 rounded-full border'
              alt={slug}
            />
          )}
          <p className='text-xl'>{data?.name}</p>
        </Link>
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  )
}

export default Navbar

export const NavbarSkeleton = () => {
  return (
    <nav className='h-20 border-b bg-white font-medium'>
      <div className='mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12'>
        <div></div>
        <Button variant='elevated' disabled className='bg-white'>
          <ShoppingCartIcon />
        </Button>
      </div>
    </nav>
  )
}
