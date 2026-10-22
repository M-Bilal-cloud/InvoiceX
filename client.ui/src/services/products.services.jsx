import axios from 'axios';

const API_URL = `http://localhost:7000/api/v1/products`;

export const fetchProduct = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const addProduct = async (newProduct, config) => {
    const res = await axios.post(API_URL, newProduct, config);
    return res.data;
};

export const fetchSingleProduct = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const updateProduct = async (id, updateProduct, config) => {
    const response = await axios.patch(`${API_URL}/${id}`, updateProduct, config);
    return response;
};

export const deleteProduct = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

// Clean stock update endpoint
export const updateProductStock = async (stockPayload) => {
    const res = await axios.patch(`${API_URL}/update-stock`, { items: stockPayload });
    return res.data;
};