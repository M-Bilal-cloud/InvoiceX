import React from 'react'
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from 'react-router-dom';

const ProductCard = ({product, onDelete}) => {
  const {price, title, stock, batch, expiry, _id} = product || {};
  return (
    <div className='w-full py-5 grid grid-cols-6 border-b border-stone-200'>
        <div className='text-center'>{title}</div>
        <div className='text-center'>{price}</div>
        <div className='text-center'>{stock}</div>
        <div className='text-center'>{batch}</div>
        <div className='text-center'>{expiry}</div>
        <div className='flex gap-3 justify-center'>
            <button onClick={() => onDelete(_id)}><MdDelete className='text-lg text-red-600 hover:text-red-500 transition-all duration-300 hover:scale-105' /></button>
            <NavLink to={`/updateProduct/${_id}`} ><CiEdit className='text-lg text-blue-600 hover:text-blue-500 transition-all duration-300 hover:scale-105' /></NavLink>
            
        </div>
    </div>
  )
}

export default ProductCard
