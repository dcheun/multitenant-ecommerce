import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useCartStore } from '@/modules/checkout/store/use-cart-store'

export const useCart = (tenantSlug: string) => {
  // NOTE: The below doesn't appear to keep the reference between renders
  // causing the useEffect to re-run.
  // const { getCartByTenant, addProduct, removeProduct, clearCart, clearAllCarts } = useCartStore()

  // NOTE: Use the below to extract from the store vs above.
  // This keeps the reference between renders.
  const addProduct = useCartStore((state) => state.addProduct)
  const removeProduct = useCartStore((state) => state.removeProduct)
  const clearCart = useCartStore((state) => state.clearCart)
  const clearAllCarts = useCartStore((state) => state.clearAllCarts)

  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []),
  )

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId)
      } else {
        addProduct(tenantSlug, productId)
      }
    },
    [addProduct, productIds, removeProduct, tenantSlug],
  )

  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId)
    },
    [productIds],
  )

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug)
  }, [clearCart, tenantSlug])

  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId)
    },
    [addProduct, tenantSlug],
  )

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId)
    },
    [removeProduct, tenantSlug],
  )

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  }
}
