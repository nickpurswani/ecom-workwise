"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { z, ZodError } from 'zod';

// Define Zod schema for validation
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
  discount: z.number().max(100).nonnegative('Discount must be a non-negative number').optional(),
  category: z.string().min(1, 'Category is required'),
});

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{product.name}</h5>
      <p className="mb-3 font-normal text-gray-700">{product.description}</p>
      <p className="mb-3 font-bold text-gray-900">${product.price}</p>
      {product.discount && (
        <p className="mb-3 text-sm text-green-600">Discount: {product.discount}%</p>
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [addProductError, setAddProductError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const { error,signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecom-workwise.onrender.com/api/seller/product', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setFetchError(errorData.error || 'Failed to fetch products');
          throw new Error('Failed to fetch products');
        }

        const productData = await response.json();
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setFetchError('An error occurred while fetching products');
      }
    };

    fetchProducts();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('jwtToken');

      // Validate newProduct data
      // const result = productSchema.safeParse(newProduct);
      // if (!result.success) {
      //   throw new ZodError(result.error.errors);
      // }

      const url = editingProduct ? `https://ecom-workwise.onrender.com/api/seller/product/${editingProduct.id}` : 'https://ecom-workwise.onrender.com/api/seller/product';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAddProductError(errorData.error || 'Failed to add or update product');
        return;
      }

      const updatedProduct = await response.json();
      if (editingProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      } else {
        setProducts((prevProducts) => [...prevProducts, updatedProduct]);
      }

      // Reset form and close modal
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discount: '',
        category: ''
      });
      setEditingProduct(null);
      setIsModalOpen(false);
      setAddProductError(null); // Clear any previous error messages
    } catch (error) {
      console.error('Error adding/updating product:', error.message);
      if (error instanceof ZodError) {
        setAddProductError(error.errors.map(e => e.message).join(', '));
      } else {
        setAddProductError('An error occurred while adding or updating the product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('jwtToken');

      const response = await fetch(`https://ecom-workwise.onrender.com/api/seller/product/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFetchError(errorData.error || 'Failed to delete product');
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error.message);
      setFetchError('An error occurred while deleting the product');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null); // Clear editing state when modal is closed
  };
  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="relative">
      <div className="fixed top-3 right-4">
        <button
          className="middle none center rounded-lg py-3 px-6 font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-dark="true"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {addProductError && <p className="text-red-500">{addProductError}</p>}
      
      <div className="fixed top-4 right-[140px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
  
      <div className="pt-[40px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
  
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            {addProductError && <p className="text-red-500 mb-4">{addProductError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-bold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={newProduct.discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                onClick={handleModalClose}
                className="ml-4 px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;

