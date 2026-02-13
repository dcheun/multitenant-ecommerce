import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn, generateTenantURL } from '@/lib/utils'
import { useCart } from '@/modules/checkout/hooks/use-cart'

interface CheckoutButtonProps {
  tenantSlug: string
  className?: string
  hideIfEmpty?: boolean
}

const CheckoutButton = ({ tenantSlug, className, hideIfEmpty }: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug)

  if (hideIfEmpty && totalItems === 0) return null

  return (
    <Button variant='elevated' asChild className={cn('bg-white', className)}>
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ''}
      </Link>
    </Button>
  )
}

export default CheckoutButton
