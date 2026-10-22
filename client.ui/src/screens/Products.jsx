import React, { useEffect, useState } from 'react'
import { deleteProduct, fetchProduct } from '../services/products.services';
import ProductCard from '../components/ProductCard';
import { ClipLoader } from "react-spinners";
import { showErrorMessage } from '../components/toastify';

const Products = () => {
  const [products, setProduct] = useState([]);
  const [spinner, setSpinner] = useState(true);

  const handleDelete = async (productId) => {
    if(!productId) return;
    try{
          if(confirm(`if you really want to delete this product`)){
              const res = await deleteProduct(productId);
                setProduct(products.filter(product => product._id !== productId));   
                showErrorMessage('Product Delete Successfully');
          }
    } catch(error){
        console.error("Error deleting product:", error.message);
    }
  }
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetchProduct();
        if (res.ok) {
          setProduct(res.product);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally{
        setSpinner(false);
      }
    }
    getProducts();
  }, []);
  if (spinner) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <ClipLoader
          color={'#57534e'}
          size={75}
        />
      </div>
    )
  }
  return (
    <div className='min-h-screen relative'>
      <div className='absolute w-[80%] rounded-xl bg-white shadow-xl p-5 left-[50%] translate-x-[-50%] top-[45%] translate-y-[-45%] '>
        <h1 className='text-center text-2xl font-bold text-stone-600'>Products</h1>
        <div className='grid grid-cols-6 pt-6 text-lg font-bold'>
          <div className='flex justify-center'>Name</div>
          <div className='flex justify-center'>Price</div>
          <div className='flex justify-center'>Stock</div>
          <div className='flex justify-center'>batch</div>
          <div className='flex justify-center'>Expiry</div>
          <div className='flex justify-center'>Actions</div>
        </div>
        <div className='flex flex-col'>
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
