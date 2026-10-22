import React, { useState, useEffect, useRef } from 'react';
import { fetchProduct, updateProductStock } from '../services/products.services';
import html2pdf from 'html2pdf.js';

const CreateInvoice = () => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const invoiceRef = useRef();

  const [allProducts, setAllProducts] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [address, setAddress] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  const [rows, setRows] = useState([
    { productId: '', name: '', batch: '', expiry: '', price: 0, quantity: 1, stock: 0, grossAmount: 0, discountPercent: 0, totalAmount: 0 }
  ]);

  useEffect(() => {
    const getProductsList = async () => {
      try {
        const response = await fetchProduct();
        if (Array.isArray(response)) {
          setAllProducts(response);
        } else if (response && Array.isArray(response.products)) {
          setAllProducts(response.products);
        } else if (response && Array.isArray(response.product)) {
          setAllProducts(response.product);
        }
      } catch (error) {
        console.log(`Product Fetch Error: ${error.message}`);
      }
    };
    getProductsList();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    let val = value;

    if (field === 'quantity') {
      const enteredQty = parseInt(value) || 0;
      const availableStock = updatedRows[index].stock;

      if (availableStock > 0 && enteredQty > availableStock) {
        alert(`Stock limit exceeded! Available stock is only ${availableStock}`);
        val = availableStock;
      }
    }

    updatedRows[index][field] = val;

    const price = parseFloat(updatedRows[index].price) || 0;
    const qty = parseInt(updatedRows[index].quantity) || 0;
    const discountPct = parseFloat(updatedRows[index].discountPercent) || 0;

    const gross = qty * price;
    const discountAmount = (gross * discountPct) / 100;
    const total = Math.max(0, gross - discountAmount);

    updatedRows[index].grossAmount = gross;
    updatedRows[index].totalAmount = total;

    setRows(updatedRows);
  };

  const handleSelectProduct = (index, selectedProd) => {
    const updatedRows = [...rows];
    updatedRows[index].productId = selectedProd._id || selectedProd.id || '';
    updatedRows[index].name = selectedProd.title || selectedProd.name || '';
    updatedRows[index].batch = selectedProd.batch || '';
    updatedRows[index].expiry = selectedProd.expiry || '';
    updatedRows[index].price = selectedProd.price || 0;
    updatedRows[index].stock = selectedProd.stock || 0;

    const qty = parseInt(updatedRows[index].quantity) || 1;
    const discountPct = parseFloat(updatedRows[index].discountPercent) || 0;
    const gross = qty * (selectedProd.price || 0);
    const discountAmount = (gross * discountPct) / 100;

    updatedRows[index].grossAmount = gross;
    updatedRows[index].totalAmount = Math.max(0, gross - discountAmount);

    setRows(updatedRows);
    setActiveDropdownIndex(null);
  };

  const handleAddRow = () => {
    if (rows.length >= 10) {
      alert("Free plan limit reached! Upgrade to Pro version to add more than 10 rows.");
      return;
    }
    setRows([
      ...rows,
      { productId: '', name: '', batch: '', expiry: '', price: 0, quantity: 1, stock: 0, grossAmount: 0, discountPercent: 0, totalAmount: 0 }
    ]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    }
  };

  const grandTotal = rows.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handlePrintInvoice = async () => {
    if (!address.trim()) {
      alert("Please enter client address first.");
      return;
    }

    const stockPayload = rows
      .filter(row => row.productId && String(row.productId).trim() !== '')
      .map(row => ({
        productId: row.productId,
        quantity: parseInt(row.quantity) || 0
      }));

    if (stockPayload.length > 0) {
      try {
        await updateProductStock(stockPayload);
      } catch (error) {
        console.log(`Stock Update Warning: ${error.message}`);
      }
    }

    setIsPrinting(true);
    setTimeout(() => {
      const element = invoiceRef.current;
      const opt = {
        margin: 0.2,
        filename: `Invoice_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        setIsPrinting(false);
      });
    }, 300);
  };

  return (
    <div className='min-h-screen bg-slate-100 py-10'>
      <div className='flex justify-center py-16'>
        <div ref={invoiceRef} className='bg-white rounded-xl w-[95%] lg:w-[90%] p-8 shadow-xl relative'>
          
          {/* Header */}
          <div className='flex justify-between items-center border-b py-'>
            <div className='flex items-center gap-3'>
              <img src="/images/logo.png" alt="Logo" className='w-[45px] h-[45px] object-contain' />
              <h1 className='text-3xl font-bold text-stone-700'>InvoiceX</h1>
            </div>

            <div className='flex items-center gap-6'>
              {!isPrinting && (
                <button 
                  onClick={handlePrintInvoice}
                  className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-all'
                >
                  Print / Download PDF
                </button>
              )}

              <div className='text-right'>
                <h1 className='text-2xl font-bold text-stone-700'>INVOICE</h1>
                <p className='text-stone-500 text-sm font-semibold'>Date: {currentDate}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className='pt-6 flex flex-col gap-3'>
            <div className='flex gap-2 items-center text-sm'>
              <span className='font-bold text-stone-700'>Address:</span> 
              {isPrinting ? (
                <span className='font-medium text-stone-800'>{address}</span>
              ) : (
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className='w-[380px] h-9 bg-white border border-stone-300 rounded-md outline-none px-3 focus:border-blue-500' 
                  placeholder='Enter Client Address here...' 
                />
              )}
            </div>
          </div>

          {/* Action Bar */}
          {!isPrinting && (
            <div className='flex justify-between items-center pt-6 pb-2'>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-bold text-stone-700'>Invoice Items</h2>
                <span className='text-xs font-semibold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full'>
                  {rows.length}/10 Rows
                </span>
              </div>
              
              <button 
                onClick={handleAddRow}
                disabled={rows.length >= 10}
                className={`${
                  rows.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md text-sm`}
              >
                + Add New Row
              </button>
            </div>
          )}

          {/* Table Header Grid */}
          <div className={`grid ${isPrinting ? 'grid-cols-11' : 'grid-cols-12'} gap-2 bg-blue-600 h-11 rounded-lg items-center text-white font-bold px-3 text-center text-xs shadow-md mt-4`}>
            <div className='col-span-3 text-left pl-2'>Product Name</div>
            <div className='col-span-1'>Batch</div>
            <div className='col-span-1'>Expiry</div>
            <div className='col-span-1'>Qty</div>
            <div className='col-span-1'>Price</div>
            <div className='col-span-1'>Gross Amt</div>
            <div className='col-span-1'>Discount</div>
            <div className='col-span-2 text-right pr-2'>Total Amount</div>
            {!isPrinting && <div className='col-span-1'>Action</div>}
          </div>

          {/* Table Body Rows */}
          <div className='flex flex-col gap-2 pt-2'>
            {rows.map((row, index) => {
              const filteredProducts = allProducts.filter((p) => {
                const prodName = p.title || p.name || '';
                return row.name.trim() !== '' && prodName.toLowerCase().includes(row.name.toLowerCase());
              });

              return (
                <div 
                  key={index} 
                  className={`grid ${isPrinting ? 'grid-cols-11' : 'grid-cols-12'} gap-2 items-center bg-slate-50 p-2 rounded-lg border border-stone-200 text-center text-xs relative`}
                >
                  
                  {/* Name Input */}
                  <div className='col-span-3 relative text-left pl-1'>
                    {isPrinting ? (
                      <span className='font-semibold text-stone-800'>{row.name}</span>
                    ) : (
                      <input 
                        type="text" 
                        value={row.name}
                        onChange={(e) => {
                          handleInputChange(index, 'name', e.target.value);
                          setActiveDropdownIndex(index);
                        }}
                        onFocus={() => setActiveDropdownIndex(index)}
                        placeholder="Type product name..."
                        className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 font-medium"
                      />
                    )}

                    {!isPrinting && activeDropdownIndex === index && filteredProducts.length > 0 && (
                      <div className='absolute z-50 left-0 top-11 w-full bg-white border border-stone-300 rounded-lg shadow-2xl max-h-48 overflow-y-auto'>
                        {filteredProducts.map((prod, pIdx) => (
                          <div 
                            key={pIdx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectProduct(index, prod);
                            }}
                            className='p-2 hover:bg-blue-100 cursor-pointer border-b border-stone-100 flex justify-between items-center transition-all'
                          >
                            <span className='font-semibold text-stone-700'>{prod.title || prod.name}</span>
                            <span className='text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded'>
                              Stock: {prod.stock ?? 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Batch */}
                  <div className='col-span-1 text-stone-700 font-medium'>
                    {isPrinting ? <span>{row.batch}</span> : (
                      <input 
                        type="text" 
                        value={row.batch}
                        onChange={(e) => handleInputChange(index, 'batch', e.target.value)}
                        placeholder="Batch"
                        className="w-full p-2 border border-stone-300 rounded-md outline-none text-center"
                      />
                    )}
                  </div>

                  {/* Expiry */}
                  <div className='col-span-1 text-stone-700 font-medium'>
                    {isPrinting ? <span>{row.expiry}</span> : (
                      <input 
                        type="text" 
                        value={row.expiry}
                        onChange={(e) => handleInputChange(index, 'expiry', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2 border border-stone-300 rounded-md outline-none text-center"
                      />
                    )}
                  </div>

                  {/* Qty */}
                  <div className='col-span-1 font-bold text-stone-800'>
                    {isPrinting ? <span>{row.quantity}</span> : (
                      <input 
                        type="number" 
                        value={row.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-md outline-none text-center font-bold"
                        min="1"
                      />
                    )}
                  </div>

                  {/* Price */}
                  <div className='col-span-1 text-stone-700 font-medium'>
                    {isPrinting ? <span>{row.price}</span> : (
                      <input 
                        type="number" 
                        value={row.price}
                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                        placeholder="0"
                        className="w-full p-2 border border-stone-300 rounded-md outline-none text-center"
                      />
                    )}
                  </div>

                  {/* Gross */}
                  <div className='col-span-1 font-semibold text-stone-600'>
                    {row.grossAmount.toFixed(0)}
                  </div>

                  {/* Discount */}
                  <div className='col-span-1 text-stone-700 font-medium'>
                    {isPrinting ? <span>{row.discountPercent}%</span> : (
                      <input 
                        type="number" 
                        value={row.discountPercent}
                        onChange={(e) => handleInputChange(index, 'discountPercent', e.target.value)}
                        placeholder="0%"
                        className="w-full p-2 border border-stone-300 rounded-md outline-none text-center text-red-600 font-semibold"
                      />
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className='col-span-2 font-bold text-stone-800 text-sm text-right pr-2'>
                    PKR {row.totalAmount.toFixed(0)}
                  </div>

                  {/* Remove Button */}
                  {!isPrinting && (
                    <div className='col-span-1'>
                      <button 
                        onClick={() => handleDeleteRow(index)}
                        disabled={rows.length === 1}
                        className={`px-2 py-1 text-[10px] rounded font-semibold ${
                          rows.length === 1 ? 'bg-gray-200 text-gray-400' : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Grand Total */}
          <div className='flex justify-end pt-6 pr-2'>
            <div className='flex gap-4 items-center bg-blue-50 p-3.5 rounded-xl border border-blue-200'>
              <span className='text-lg font-bold text-stone-700'>Grand Total:</span>
              <span className='text-2xl font-bold text-blue-600'>
                PKR {grandTotal.toFixed(0)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;