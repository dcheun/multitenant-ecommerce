import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CustomCategory } from '../types'

interface CategoriesSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: CustomCategory[] // TODO: Remove this later
}

const CategoriesSidebar = ({ open, onOpenChange, data }: CategoriesSidebarProps) => {
  const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null)

  const router = useRouter()

  // If we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? []

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories?.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[])
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
