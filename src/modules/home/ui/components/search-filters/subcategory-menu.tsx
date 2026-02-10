import { CategoriesGetManyOutput } from '@/modules/categories/types'
import { Category } from '@/payload-types'
import Link from 'next/link'

interface SubcategoryMenuProps {
  category: CategoriesGetManyOutput[1]
  isOpen: boolean
}

const SubcategoryMenu = ({ category, isOpen }: SubcategoryMenuProps) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null
  }

  const backgroundColor = category.color || '#F5F5F5'

  return (
    <div
      className='absolute z-100'
      style={{
        top: '100%',
        left: 0,
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className='h-3 w-60' />
      <div
        style={{ backgroundColor }}
        className='w-60 -translate-x-[2px] -translate-y-[2px] overflow-hidden rounded-md border text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
      >
        <p>
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className='flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white'
            >
              {subcategory.name}
            </Link>
          ))}
        </p>
      </div>
    </div>
  )
}

export default SubcategoryMenu
