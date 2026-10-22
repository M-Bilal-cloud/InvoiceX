import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home";
import Products from "../screens/Products";
import UpdateProduct from "../screens/UpdateProduct";
import Invoice from "../screens/Invoice";
import CreateInvoice from "../screens/CreateInvoice";
import Layout from "../components/Layout";
import AddProduct from "../screens/AddProduct";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children:[
            { 
             index: true, 
              element: <Home />
            },
            {
                path:'products', 
                element: <Products />},
            {
                path:'updateProduct', 
                element: <UpdateProduct />},
            {
                path:'invoice', 
                element: <Invoice />},
            {
                path:'createInvoice', 
                element: <CreateInvoice />},
                {
                path:'updateProduct/:id', 
                element: <UpdateProduct />},
                {
                path:'addProduct', 
                element: <AddProduct />},
        ]
    }
])