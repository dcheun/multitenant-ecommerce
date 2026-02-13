'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { generateTenantURL } from '@/lib/utils'

interface NavbarProps {
  slug: string
}

const Navbar = ({ slug }: NavbarProps) => {
  return (
    <nav className='h-20 border-b bg-white font-medium'>
      <div className='mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12'>
        <p className='text-xl'>Checkout</p>
        <Button variant='elevated' asChild>
          <Link href={generateTenantURL(slug)}>Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
