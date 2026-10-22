import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
      <div className='min-h-screen relative '>
        <Navbar />

        <main className='absolute w-full h-full'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout
