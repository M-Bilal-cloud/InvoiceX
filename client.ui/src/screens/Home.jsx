import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <div className="bg-[url('/images/bg-image.png')] min-h-screen bg-cover bg-no-repeat relative">
            <div className='absolute top-[20%] translate-y-[-20%] left-[50%] translate-x-[-50%]'>
                <h1 className='text-2xl font-semibold text-white text-center'>Smart Invoicing Made Simple & Fast</h1>
                <h2 className='text-white'>Create, manage, and track your invoices and products effortlessly in one place.</h2>
                    <div className='flex justify-center pt-5'>
                        <Link to='/createInvoice' className="custom-btn">Create Invoice</Link>
                    </div>
            </div>
    </div>
  )
}

export default Home
