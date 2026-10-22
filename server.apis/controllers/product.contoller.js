import { catchError } from "../helpers/message.js";
import { Product } from "../models/product.model.js"


const getProduct = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            ok: true,
            message: products.length > 0 ? 'Product Found Successfully' : 'NO Product Found in database',
            count: products.length,
            product: products
        });
    } catch (error) {
        catchError(res, error, 404);
    }
}

const addProduct = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) throw new Error('Please Enter All Require Fields');

        let { price, stock, title, batch, expiry } = req.body;

        if (!batch?.trim() || !title?.trim() || !expiry?.trim()) throw new Error('Please enter valid Title, Batch, and Expiry details');

        if (price === undefined || price === null || String(price).trim() === '') throw new Error('Please Enter Vaild Price');
        price = Number(price);
        if (isNaN(price) || price < 0) throw new Error('Price Should be grater then zero and a number');

        if (stock === undefined || stock === null || String(stock).trim() === '') throw new Error('Please Enter Vaild stock');
        stock = Number(stock);
        if (isNaN(stock) || stock < 0) throw new Error('Stock Should be grater then zero and a number');

        const newProduct = await Product.create({
            price,
            stock,
            title,
            batch,
            expiry
        });

        res.status(201).json({
            ok: true,
            message: 'Product Saved in database successfully',
            product: newProduct
        });
    } catch (error) {
        catchError(res, error, 400);
    }
}


const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) throw new Error('Product Id not found');

        const product = await Product.findById(productId);
        if (!product) throw new Error('Product Not exist in database');

        res.status(200).json({
            ok: true,
            message: 'Single Product Found Successfully',
            product: product
        });
    } catch (error) {
        catchError(res, error, 404);
    }
}


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) throw new Error('Product Id not found');

        if (Object.keys(req.body).length === 0) throw new Error('Please modify at least one field to update the product');

        const productKeys = ['title', 'batch', 'expiry'];
        for (const key of productKeys) {
            if (req.body[key] !== undefined) {
                const value = req.body[key];
                if (!value?.trim()) {
                    throw new Error(`Please Send Vaild Request ${key}`);
                }
            }
        }

        if (req.body.price !== undefined) {
            const price = Number(req.body.price);
            if (isNaN(price) || price < 0) throw new Error('Please Enter Vaild Price');
            req.body.price = price
        }

        if (req.body.stock !== undefined) {
            const stock = Number(req.body.stock);
            if (isNaN(stock) || stock < 0) throw new Error('Please Enter Vaild Stock');
            req.body.stock = stock
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json({
            ok: true,
            message: 'Product Updated Successfully',
            product: updatedProduct
        });
    } catch (error) {
        catchError(res, error, 400);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) throw new Error('Product Id required');

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new Error('Product not found in database');
        }

        res.status(200).json({
            ok: true,
            message: 'Product deleted successfully',
            product: deletedProduct
        });
    } catch (error) {
        catchError(res, error, 400);
    }
}
// Invoice Create ya Print hone par stock deduct karne ki API
// POST / PATCH: /api/v1/products/update-stock
const updateProductStock = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No items provided" 
      });
    }

    // Loop through each item and decrement stock
    for (let item of items) {
      if (item.productId && item.quantity > 0) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully!"
    });
  } catch (error) {
    console.error("Stock Update Error Server:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
    getProduct,
    addProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
}