import express from 'express';
const app = express();
import cors from 'cors';
import { mongodbConnection } from './config/mongodb.connection.js';
import { PORT } from './config/config.js';
import { productRouter } from './routers/product.routes.js';
app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRouter);


const port = PORT || 9000;
app.listen(port, () => {
    console.log(`server is running on this port: http://localhost:${port}/api/v1`);
});
mongodbConnection();

