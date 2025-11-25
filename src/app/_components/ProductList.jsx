import React from 'react'
import ProductItem from './ProductItem'

function ProductList({ productList }) { // Changed from ProductList to productList
  // Add error handling for undefined productList
  if (!productList || !Array.isArray(productList)) {
    console.log("ProductList data is missing or invalid:", productList);
    return (
      <div className='mt-8 mb-12 px-4 sm:px-6 lg:px-8 gap-5'>
        <h2 className='text-green-700 font-bold text-lg sm:text-xl md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
          Our Popular Products
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className='  mt-8 mb-12 px-4 sm:px-6 lg:px-8 gap-5'>
        <h2 className='text-green-700 font-bold text-lg sm:text-xl md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
          Our Popular Products
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-8 mb-12 px-4 sm:px-6 lg:px-8 gap-5'>
      <h2 className='text-green-700 font-bold text-lg sm:text-xl md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 '>
        Our Popular Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList.map((product, index) => index < 8 && (
          <ProductItem key={product.id || index} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList