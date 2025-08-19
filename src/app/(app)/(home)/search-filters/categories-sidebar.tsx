import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CategoriesGetManyOutput } from '@/modules/categories/types'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CategoriesSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CategoriesSidebar = ({ open, onOpenChange }: CategoriesSidebarProps) => {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.categories.getMany.queryOptions())

  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutput[1] | null>(null)

  const router = useRouter()

  // If we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? []

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories?.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput)
      setSelectedCategory(category)
    } else {
      // This is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        // This is a subcategory - navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else {
        // This is a main category - navigate to /category
        if (category.slug === 'all') {
          router.push('/')
        } else {
          router.push(`/${category.slug}`)
        }
      }

      handleOpenChange(false)
    }
  }

  const handleBackClick = () => {
    if (!parentCategories) {
      return
    }
    setParentCategories(null)
    setSelectedCategory(null)
  }

  const backgroundColor = selectedCategory?.color || 'white'

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null)
    setSelectedCategory(null)
    onOpenChange(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side='left' className='p-0 transition-none' style={{ backgroundColor }}>
        <SheetHeader className='p-4 border-b'>
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2'>
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer'
            >
              <ChevronLeftIcon className='size-4 mr-2' />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer'
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className='size-4' />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CategoriesSidebar
