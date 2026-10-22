import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchSingleProduct, updateProduct } from '../services/products.services';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { showSuccessMessage } from '../components/toastify';



const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productTitle: '',
    productPrice: '',
    productStock: '',
    productBatch: '',
    productExpiry: ''
  });


  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await fetchSingleProduct(id);
        const prod = response.product;
        if (prod) {
          setFormData({
            productTitle: prod.title || '',
            productPrice: prod.price || '',
            productStock: prod.stock || '',
            productBatch: prod.batch || '',
            productExpiry: prod.expiry || ''
          })
        }
      } catch (error) {
        console.log(`Single Product Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (id) getSingleProduct();
  }, [id]);

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      title: formData.productTitle,
      price: formData.productPrice,
      stock: formData.productStock,
      batch: formData.productBatch,
      expiry: formData.productExpiry
    }
    
    const config = {
      method: 'patch',
      headers:{
      'Content-Type': 'application/json'
    }
    }

    const response = await updateProduct(id, updatedProduct, config);
    showSuccessMessage('Product Successfully Updated');

    setTimeout(() => {
      navigate('/products');
    }, 2000);
  }


  if (loading) {
    return (
      <div className='text-center items-center'>
        <ClipLoader color={'#57534e'} size={75} />
      </div>
    )
  }
  return (
    <div className='h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-1/2 rounded-xl bg-white shadow-xl'>
        <h1 className='text-center text-2xl font-bold text-stone-600 p-5'>Update Product</h1>
        <div className='flex flex-col gap-5 p-5'>
          <input
            name='productTitle'
            value={formData.productTitle}
            onChange={handleChange}
            type="text" 
            className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Update Product Name' />
          <input 
          name='productPrice'
          value={formData.productPrice}
          onChange={handleChange}
          type="text" 
          className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Update Product Price' />
          <input 
          name='productStock'
          value={formData.productStock}
          onChange={handleChange}
          type="text" 
          className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Update Product stock' />
          <input 
          name='productBatch'
          value={formData.productBatch}
          onChange={handleChange}
          type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Update Product batch' />
          <input 
          name='productExipry'
          value={formData.productExpiry}
          onChange={handleChange}
          type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Update Product expiry' />
          <div className='flex justify-center '>
            <button className='custom-btn'>Update Product</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateProduct
