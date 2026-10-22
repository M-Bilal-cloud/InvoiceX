import { useState } from 'react'
import './css/style.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
 import { ToastContainer, toast } from 'react-toastify';

function App() {
 

  return (
    <div className='min-h-screen bg-[#D0CFCC]'>
        <RouterProvider router={router} /> 
        <ToastContainer /> 
    </div>
  )
}

export default App
