import React, { useEffect, useState } from 'react';
import { deleteProduct, fetchProduct } from '../services/products.services';
import ProductCard from '../components/ProductCard';
import { ClipLoader } from "react-spinners";
import { showErrorMessage } from '../components/toastify';

const Products = () => {
  const [products, setProduct] = useState([]);
  const [spinner, setSpinner] = useState(true);

  const handleDelete = async (productId) => {
    if(!productId) return;
    try {
      if(confirm(`If you really want to delete this product?`)){
        await deleteProduct(productId);
        setProduct(products.filter(product => product._id !== productId));   
        showErrorMessage('Product Deleted Successfully');
      }
    } catch(error) {
      console.error("Error deleting product:", error.message);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetchProduct();
        if (res.ok) {
          setProduct(res.product);
        } else if (Array.isArray(res)) {
          setProduct(res);
        } else if (res && Array.isArray(res.products)) {
          setProduct(res.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setSpinner(false);
      }
    };
    getProducts();
  }, []);

  if (spinner) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <ClipLoader color={'#57534e'} size={75} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start md:items-center'>
      
      {/* Container Box */}
      <div className='w-full max-w-6xl rounded-2xl bg-white shadow-xl p-4 sm:p-6 md:p-8'>
        
        <h1 className='text-center text-xl sm:text-2xl md:text-3xl font-bold text-stone-600 mb-6'>
          Products List
        </h1>

        {/* Scrollable Table Container */}
        <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
          
          <div className='min-w-[650px]'>
            
            {/* Table Header */}
            <div className='grid grid-cols-6 bg-stone-100 py-3 text-xs sm:text-sm md:text-base font-bold text-stone-700 border-b border-gray-200'>
              <div className='text-center'>Name</div>
              <div className='text-center'>Price</div>
              <div className='text-center'>Stock</div>
              <div className='text-center'>Batch</div>
              <div className='text-center'>Expiry</div>
              <div className='text-center'>Actions</div>
            </div>

            {/* Table Body */}
            <div className='flex flex-col divide-y divide-gray-100'>
              {products.length > 0 ? (
                products.map(product => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    onDelete={handleDelete} 
                  />
                ))
              ) : (
                <div className='text-center py-8 text-stone-400 font-medium'>
                  No products found.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Products;