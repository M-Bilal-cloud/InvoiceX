import React, { useState, useEffect, useRef } from 'react';
import { fetchProduct, updateProductStock } from '../services/products.services';
import html2pdf from 'html2pdf.js';

const emptyRow = () => ({
  productId: '',
  name: '',
  batch: '',
  expiry: '',
  price: 0,
  quantity: 1,
  stock: 0,
  grossAmount: 0,
  discountPercent: 0,
  totalAmount: 0,
});

// Single place for the math so every handler stays consistent
const recalc = (row) => {
  const price = parseFloat(row.price) || 0;
  const qty = parseInt(row.quantity) || 0;
  const discountPct = parseFloat(row.discountPercent) || 0;
  const gross = qty * price;
  const total = Math.max(0, gross - (gross * discountPct) / 100);
  return { ...row, grossAmount: gross, totalAmount: total };
};

const CreateInvoice = () => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const invoiceRef = useRef();

  const [allProducts, setAllProducts] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [address, setAddress] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);

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
    let val = value;

    if (field === 'quantity') {
      const enteredQty = parseInt(value) || 0;
      const availableStock = rows[index].stock;
      if (availableStock > 0 && enteredQty > availableStock) {
        alert(`Stock limit exceeded! Available stock is only ${availableStock}`);
        val = availableStock;
      }
    }

    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, [field]: val };
        // Name edit by hand => detach from the previously selected product
        if (field === 'name') {
          next.productId = '';
          next.stock = 0;
        }
        return recalc(next);
      })
    );
  };

  const handleSelectProduct = (index, p) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i !== index
          ? row
          : recalc({
              ...row,
              productId: p._id || p.id || '',
              name: p.title || p.name || '',
              batch: p.batch || '',
              expiry: p.expiry || '',
              price: p.price || 0,
              stock: p.stock || 0,
            })
      )
    );
    setActiveDropdownIndex(null);
  };

  const handleAddRow = () => {
    if (rows.length >= 10) {
      alert('Free plan limit reached! Upgrade to Pro version to add more than 10 rows.');
      return;
    }
    setRows((prev) => [...prev, emptyRow()]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const grandTotal = rows.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handlePrintInvoice = async () => {
    if (isPrinting) return; // prevent double click => double stock deduction

    if (!address.trim()) {
      alert('Please enter client address first.');
      return;
    }

    const stockPayload = rows
      .filter((row) => row.productId && String(row.productId).trim() !== '')
      .map((row) => ({
        productId: row.productId,
        quantity: parseInt(row.quantity) || 0,
      }));

    setIsPrinting(true);

    if (stockPayload.length > 0) {
      try {
        await updateProductStock(stockPayload);
      } catch (error) {
        console.log(`Stock Update Warning: ${error.message}`);
      }
    }

    // wait for React to re-render the print layout
    setTimeout(() => {
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `Invoice_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      html2pdf()
        .set(opt)
        .from(invoiceRef.current)
        .save()
        .then(() => setIsPrinting(false))
        .catch(() => setIsPrinting(false));
    }, 400);
  };

  const gridCols = isPrinting ? 'grid-cols-11' : 'grid-cols-12';

  return (
    <div className="min-h-screen bg-slate-100 pt-32 pb-10 flex flex-col items-center">
      <div className="w-full max-w-4xl px-3 sm:px-4 flex flex-col items-center">
        {/* Printable Card */}
        <div
          ref={invoiceRef}
          style={isPrinting ? { width: '720px' } : undefined}
          className={`bg-white w-full p-4 sm:p-8 relative ${
            isPrinting ? '' : 'rounded-xl shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="w-[45px] h-[45px] object-contain" />
              <h1 className="text-3xl font-bold text-stone-700">InvoiceX</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {!isPrinting && (
                <button
                  onClick={handlePrintInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-md transition-all whitespace-nowrap"
                >
                  Print / Download PDF
                </button>
              )}

              <div className="text-right">
                <h1 className="text-2xl font-bold text-stone-700">INVOICE</h1>
                <p className="text-stone-500 text-sm font-semibold whitespace-nowrap">Date: {currentDate}</p>
              </div>
            </div>
          </div>

          {/* Divider (separate element: border-b clashes with html2canvas text) */}
          <div className="h-px bg-stone-200 mt-4" />

          {/* Address */}
          <div className="pt-6 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="font-bold text-stone-700">Address:</span>
              {isPrinting ? (
                <span className="font-medium text-stone-800">{address}</span>
              ) : (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full sm:w-[380px] h-9 bg-white border border-stone-300 rounded-md outline-none px-3 focus:border-blue-500"
                  placeholder="Enter Client Address here..."
                />
              )}
            </div>
          </div>

          {/* Action Bar */}
          {!isPrinting && (
            <div className="flex flex-wrap justify-between items-center gap-3 pt-6 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-700 whitespace-nowrap">Invoice Items</h2>
                <span className="text-xs font-semibold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {rows.length}/10 Rows
                </span>
              </div>

              <button
                onClick={handleAddRow}
                disabled={rows.length >= 10}
                className={`${
                  rows.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md text-sm whitespace-nowrap`}
              >
                + Add New Row
              </button>
            </div>
          )}

          {/* Table: scrolls sideways on small screens instead of squashing */}
          <div className={isPrinting ? '' : 'overflow-x-auto lg:overflow-visible pb-2'}>
            <div className={isPrinting ? '' : 'min-w-[820px] lg:min-w-0'}>
              {/* Table Header */}
              <div
                className={`grid ${gridCols} gap-2 bg-blue-600 min-h-[44px] rounded-lg items-center text-white font-bold px-3 text-center text-xs shadow-md mt-4`}
              >
                <div className="col-span-3 text-left pl-2">Product Name</div>
                <div className="col-span-1">Batch</div>
                <div className="col-span-1">Expiry</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Gross Amt</div>
                <div className="col-span-1">Discount</div>
                <div className="col-span-2 text-right pr-2">Total Amount</div>
                {!isPrinting && <div className="col-span-1">Action</div>}
              </div>

              {/* Rows */}
              <div className={`flex flex-col gap-2 pt-2 ${isPrinting ? '' : 'min-h-[120px]'}`}>
                {rows.map((row, index) => {
                  const filteredProducts = allProducts.filter((p) => {
                    const prodName = p.title || p.name || '';
                    return row.name.trim() !== '' && prodName.toLowerCase().includes(row.name.toLowerCase());
                  });

                  return (
                    <div
                      key={index}
                      className={`grid ${gridCols} gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-stone-200 text-center text-xs relative`}
                    >
                      {/* Name */}
                      <div className="col-span-3 relative text-left pl-1">
                        {isPrinting ? (
                          <span className="font-semibold text-stone-800 break-words">{row.name}</span>
                        ) : (
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => {
                              handleInputChange(index, 'name', e.target.value);
                              setActiveDropdownIndex(index);
                            }}
                            onFocus={() => setActiveDropdownIndex(index)}
                            onBlur={() => setActiveDropdownIndex(null)}
                            placeholder="Type product name..."
                            className="w-full p-2 border border-stone-300 rounded-md outline-none focus:border-blue-500 font-medium"
                          />
                        )}

                        {!isPrinting && activeDropdownIndex === index && filteredProducts.length > 0 && (
                          <div className="absolute z-50 left-0 top-11 w-full bg-white border border-stone-300 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                            {filteredProducts.map((prod, pIdx) => (
                              <div
                                key={pIdx}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectProduct(index, prod);
                                }}
                                className="p-2 hover:bg-blue-100 cursor-pointer border-b border-stone-100 flex justify-between items-center gap-2 transition-all"
                              >
                                <span className="font-semibold text-stone-700">{prod.title || prod.name}</span>
                                <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                  Stock: {prod.stock ?? 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Batch */}
                      <div className="col-span-1 text-stone-700 font-medium">
                        {isPrinting ? (
                          <span>{row.batch}</span>
                        ) : (
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
                      <div className="col-span-1 text-stone-700 font-medium">
                        {isPrinting ? (
                          <span>{row.expiry}</span>
                        ) : (
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
                      <div className="col-span-1 font-bold text-stone-800">
                        {isPrinting ? (
                          <span>{row.quantity}</span>
                        ) : (
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
                      <div className="col-span-1 text-stone-700 font-medium">
                        {isPrinting ? (
                          <span>{row.price}</span>
                        ) : (
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
                      <div className="col-span-1 font-semibold text-stone-600">{row.grossAmount.toFixed(0)}</div>

                      {/* Discount */}
                      <div className="col-span-1 text-stone-700 font-medium">
                        {isPrinting ? (
                          <span>{row.discountPercent}%</span>
                        ) : (
                          <input
                            type="number"
                            value={row.discountPercent}
                            onChange={(e) => handleInputChange(index, 'discountPercent', e.target.value)}
                            placeholder="0%"
                            min="0"
                            max="100"
                            className="w-full p-2 border border-stone-300 rounded-md outline-none text-center text-red-600 font-semibold"
                          />
                        )}
                      </div>

                      {/* Total */}
                      <div className="col-span-2 font-bold text-stone-800 text-sm text-right pr-2 whitespace-nowrap">
                        PKR {row.totalAmount.toFixed(0)}
                      </div>

                      {/* Remove */}
                      {!isPrinting && (
                        <div className="col-span-1">
                          <button
                            onClick={() => handleDeleteRow(index)}
                            disabled={rows.length === 1}
                            className={`px-2 py-1 text-[10px] rounded font-semibold ${
                              rows.length === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'
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
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-end pt-8 pb-2">
            <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <span className="text-lg font-bold text-stone-700 whitespace-nowrap">Grand Total:</span>
              <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">PKR {grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;