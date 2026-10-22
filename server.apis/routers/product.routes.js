import express from 'express';
import * as prod from '../controllers/product.contoller.js';

export const productRouter = express.Router();

// 1. Root Routes
productRouter.route('/')
    .get(prod.getProduct)
    .post(prod.addProduct);

// 2. Static Route MUST BE BEFORE /:id
productRouter.patch('/update-stock', prod.updateProductStock);

// 3. Dynamic ID Routes (Hamesha end par)
productRouter.route('/:id')
    .get(prod.getSingleProduct)
    .patch(prod.updateProduct)
    .delete(prod.deleteProduct);