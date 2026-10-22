import { useRef, useState } from 'react';
import { showErrorMessage, showSuccessMessage } from '../components/toastify';
import { addProduct, updateProduct } from '../services/products.services';
import { Navigate, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [newProduct, setProduct] = useState({
    title: '',
    price: '',
    stock: '',
    expiry: '',
    batch: ''
  });

const naviagte = useNavigate();

  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const stockRef = useRef(null);
  const batchRef = useRef(null);
  const expiryRef = useRef(null);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProduct({ ...newProduct, [name]: value });
    console.log(`${name}: ${value}`);
  }; 

  const wrongAnimation = (element) => {
    if(!element) return;
    element.classList.add('wrong-input');
    setTimeout(() => {
       element.classList.remove('wrong-input'); 
    }, 1000);
  }; 

  const sumbitForm = async (e) => {
    e.preventDefault();

    if (newProduct.title.trim() === '') {
      showErrorMessage('Please Enter Product Title');
      wrongAnimation(titleRef.current);
      return;
    } 
    if (String(newProduct.price).trim() === '') {
      showErrorMessage('Please Enter Product Price');
      wrongAnimation(priceRef.current); // .current lagaya gaya hai
      return;
    } 
    if (String(newProduct.stock).trim() === '') {
      showErrorMessage('Please Enter Product Stock');
      wrongAnimation(stockRef.current); // .current lagaya gaya hai
      return;
    } 
    if (newProduct.batch.trim() === '') {
      showErrorMessage('Please Enter Product Batch Number');
      wrongAnimation(batchRef.current);
      return;
    } 
    if (newProduct.expiry.trim() === '') {
      showErrorMessage('Please Enter Product Expiry');
      wrongAnimation(expiryRef.current);
      return;
    }

    const parsedPrice = Number(newProduct.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showErrorMessage('Price Should be a Number and greater than zero');
      wrongAnimation(priceRef.current);
      return;
    }

    const parsedStock = Number(newProduct.stock);
    if (isNaN(parsedStock) || parsedStock <= 0) {
      showErrorMessage('Stock Should be a Number and greater than zero');
      wrongAnimation(stockRef.current);
      return;
    }

    const finalProductData = {
  ...newProduct,
  price: Number(newProduct.price),
  stock: Number(newProduct.stock)
};

 try{
  const config = {
    method: 'post',
    header:{
      "Content-Type": 'application/json'
    }
  }
    const response = await addProduct(finalProductData, config);
    if(response.ok){
      showSuccessMessage('Product Add Successfully');
      setTimeout(() => {
          naviagte('/products');
      }, 2000);
    }
 } catch(error){
    console.log(`Add Product Error: ${error.message}`);
 }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <form onSubmit={sumbitForm} className='w-1/2 bg-white rounded-xl shadow-xl'>
            <h1 className='text-center text-2xl font-bold py-5 text-stone-600'>Add New Product</h1>
            <div className='flex flex-col gap-5 px-5 py-10 '>
              <input 
              name='title'
              value={newProduct.title}
              onChange={changeHandler}
              ref={titleRef}
              type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Enter Product Name'/>
              
              <input 
              name='price'
              value={newProduct.price}
              onChange={changeHandler}
              ref={priceRef}
              type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Enter Product Price'/>
              
              <input 
              name='stock'
              value={newProduct.stock}
              onChange={changeHandler}
              ref={stockRef}
              type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Enter Product Stock'/>
              
              <input 
              name='batch'
              value={newProduct.batch}
              onChange={changeHandler}
              ref={batchRef}
              type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Enter Product Batch'/>
              
              <input 
              name='expiry'
              value={newProduct.expiry}
              onChange={changeHandler}
              ref={expiryRef}
              type="text" className='w-[400px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-10 rounded-xl p-2 outline-none' placeholder='Enter Product Expiry'/>
              
              <div className='flex justify-center'>
                  <button type='submit' className='custom-btn'>Add Product</button>
              </div>
            </div>
        </form>
    </div>
  );
};

export default AddProduct;