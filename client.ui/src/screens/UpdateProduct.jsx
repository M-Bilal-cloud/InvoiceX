import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSingleProduct, updateProduct } from '../services/products.services';
import { ClipLoader } from 'react-spinners';
import { showSuccessMessage } from '../components/toastify';

const UpdateProduct = () => {
  const { id } = useParams();
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
        const prod = response.product || response;
        if (prod) {
          setFormData({
            productTitle: prod.title || '',
            productPrice: prod.price || '',
            productStock: prod.stock || '',
            productBatch: prod.batch || '',
            productExpiry: prod.expiry || ''
          });
        }
      } catch (error) {
        console.log(`Single Product Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

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
      price: Number(formData.productPrice),
      stock: Number(formData.productStock),
      batch: formData.productBatch,
      expiry: formData.productExpiry
    };
    
    const config = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      await updateProduct(id, updatedProduct, config);
      showSuccessMessage('Product Successfully Updated');

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.log(`Update Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <ClipLoader color={'#57534e'} size={75} />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex justify-center items-center p-4 bg-gray-50'>
      <form 
        onSubmit={handleSubmit} 
        className='w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-w-xl bg-white rounded-xl shadow-xl p-6 md:p-8'
      >
        <h1 className='text-center text-xl sm:text-2xl font-bold pb-6 text-stone-600'>
          Update Product
        </h1>
        
        <div className='flex flex-col gap-4 items-center w-full'>
          <input
            name='productTitle'
            value={formData.productTitle}
            onChange={handleChange}
            type="text" 
            className='w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] h-11 rounded-xl px-4 outline-none transition-all focus:ring-2 focus:ring-blue-400' 
            placeholder='Update Product Name' 
          />
          
          <input 
            name='productPrice'
            value={formData.productPrice}
            onChange={handleChange}
            type="text" 
            className='w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] h-11 rounded-xl px-4 outline-none transition-all focus:ring-2 focus:ring-blue-400' 
            placeholder='Update Product Price' 
          />
          
          <input 
            name='productStock'
            value={formData.productStock}
            onChange={handleChange}
            type="text" 
            className='w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] h-11 rounded-xl px-4 outline-none transition-all focus:ring-2 focus:ring-blue-400' 
            placeholder='Update Product Stock' 
          />
          
          <input 
            name='productBatch'
            value={formData.productBatch}
            onChange={handleChange}
            type="text" 
            className='w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] h-11 rounded-xl px-4 outline-none transition-all focus:ring-2 focus:ring-blue-400' 
            placeholder='Update Product Batch' 
          />
          
          <input 
            name='productExpiry'
            value={formData.productExpiry}
            onChange={handleChange}
            type="text" 
            className='w-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] h-11 rounded-xl px-4 outline-none transition-all focus:ring-2 focus:ring-blue-400' 
            placeholder='Update Product Expiry' 
          />
          
          <div className='flex justify-center w-full pt-4'>
            <button type='submit' className='custom-btn w-full sm:w-auto px-8 py-2.5'>
              Update Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;