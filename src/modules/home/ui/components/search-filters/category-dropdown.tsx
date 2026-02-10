'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategoriesGetManyOutput } from '@/modules/categories/types'
import Link from 'next/link'
import { useRef, useState } from 'react'
import SubcategoryMenu from './subcategory-menu'

interface CategoryDropdownProps {
  category: CategoriesGetManyOutput[1]
  isActive?: boolean
  isNavigationHovered: boolean
}

const CategoryDropdown = ({ category, isActive, isNavigationHovered }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true)
    }
  }

  const onMouseLeave = () => {
    setIsOpen(false)
  }

  // TODO: Potentiall improve mobile experience
  // const toggleDropdown = () => {
  //   if (!category.subcategories.length) return
  //   setIsOpen(!isOpen)
  // }

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={toggleDropdown}
    >
      <div className='relative'>
        <Button
          variant='elevated'
          className={cn(
            'hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white',
            isActive && !isNavigationHovered && 'border-primary bg-white',
            isOpen &&
              'border-primary -translate-x-[4px] -translate-y-[4px] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          )}
          asChild
        >
          <Link href={`/${category.slug === 'all' ? '' : category.slug}`}>{category.name}</Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              'absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-black border-l-transparent opacity-0',
              isOpen && 'opacity-100',
            )}
          />
        )}
      </div>
      <SubcategoryMenu category={category} isOpen={isOpen} />
    </div>
  )
}

export default CategoryDropdown
