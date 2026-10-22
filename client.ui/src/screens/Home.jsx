import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-[url('/images/bg-image.png')] min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-4">
      
      {/* Background Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-2xl w-full text-center p-6 md:p-10 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Smart Invoicing Made Simple & Fast
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-4 leading-relaxed max-w-lg mx-auto">
          Create, manage, and track your invoices and products effortlessly in one place.
        </p>

        <div className="flex justify-center pt-8">
          <Link 
            to="/createInvoice" 
            className="custom-btn hover:scale-105 transition-transform duration-200 shadow-lg px-8 py-3 text-base font-semibold"
          >
            Create Invoice
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;