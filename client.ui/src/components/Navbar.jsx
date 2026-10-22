import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='absolute w-full z-50 top-5 flex justify-center'>
        <div className='w-[90%] h-14 bg-white/40 backdrop-blur-[40px] shadow-xl rounded-[30px] flex items-center'>  
            <div className='grid grid-cols-3 w-full'>
                <div className='flex justify-start pl-10'>
                    <NavLink to='/' className='flex items-center' >
                        <img src="/images/logo.png" className='h-[40px]' alt="" />
                        <h1 className='font-semibold'>InvoiceX</h1>
                    </NavLink>
                    
                </div>
                <div className='flex justify-center gap-5'>
                    <NavLink to='/products' className='custom-btn' >Products</NavLink>
                    <NavLink to='/addProduct' className='custom-btn' >Add Products</NavLink>
                </div>
                <div className='flex justify-end pr-10 gap-5'>
                    <NavLink to='/invoice' className='custom-btn' >Invoice</NavLink>
                     <NavLink to='/createInvoice' className='custom-btn' >Create Invoice</NavLink>
                </div>
    
            </div>
        </div>
    </div>
  )
}

export default Navbar
