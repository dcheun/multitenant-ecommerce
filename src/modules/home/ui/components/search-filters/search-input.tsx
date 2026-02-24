import { useQuery } from '@tanstack/react-query'
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CategoriesSidebar from '@/modules/home/ui/components/search-filters/categories-sidebar'
import { useTRPC } from '@/trpc/client'

interface Props {
  disabled?: boolean
  defaultValue?: string | undefined
  onChange?: (value: string) => void
}

const SearchInput = ({ disabled, defaultValue, onChange }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(defaultValue || '')

  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(searchValue)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchValue, onChange])

  return (
    <div className='flex w-full items-center gap-2'>
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className='relative w-full'>
        <SearchIcon className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500' />
        <Input
          className='pl-8'
          placeholder='Search products'
          disabled={disabled}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <Button
        variant='elevated'
        className='flex size-12 shrink-0 lg:hidden'
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>

      {session.data?.user && (
        <Button variant='elevated' asChild>
          <Link prefetch href='/library'>
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  )
}

export default SearchInput
