import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function CategoryList({CategoryList}) {
  return (
    <div id="categories" className='mt-8 mb-12 px-4 sm:px-6 lg:px-8'> 
       {/* Left-aligned header with responsive typography */}
       <h2 className='text-green-700 font-bold text-lg sm:text-xl md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
         Shop By Category
       </h2>
       
       {/* Responsive grid layout */}
       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6'>
        {CategoryList.map((category,index)=>(
            <Link href={`/products-category/${encodeURIComponent(category.name)}`}
              key={category.id || index} 
              className='flex flex-col items-center p-3  bg-green-100 rounded-xl cursor-pointer group hover:bg-green-300'
            >
                {/* Category Icon Container */}
                <div className='mb-2 sm:mb-3 p-2 sm:p-3  rounded-full '>
                  <Image 
                    src={process.env.NEXT_PUBLIC_BACKEND_URL+category.icon?.[0]?.formats?.small?.url || process.env.NEXT_PUBLIC_BACKEND_URL+category.icon?.[0]?.url}
                    width={40}
                    height={40}
                    alt={category.name || 'category icon'}
                    className='object-contain w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-125 transition-all ease-in-out'
                  />
                </div>
                
                {/* Category Name */}
                <h2 className='text-green-800 '>
                  {category.name}
                </h2>
            </Link>
            ))}
       </div>
    </div>
  )
}

export default CategoryList