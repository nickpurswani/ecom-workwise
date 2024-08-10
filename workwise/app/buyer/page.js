"use client";

import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{product.name}</h5>
      <p className="mb-3 font-normal text-gray-700">{product.description}</p>
      <p className="mb-3 font-bold text-gray-900">${product.price}</p>
      {product.discount && (
        <p className="mb-3 text-sm text-green-600">Discount: {product.discount}%</p>
      )}
      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

const Buyer = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [productRes, cartRes] = await Promise.all([
          fetch('http://localhost:5000/api/buyer/products', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/buyer/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!productRes.ok) {
          throw new Error(`Failed to fetch products: ${productRes.status}`);
        }

        if (!cartRes.ok) {
          throw new Error(`Failed to fetch cart items: ${cartRes.status}`);
        }

        const productData = await productRes.json();
        const cartData = await cartRes.json();
        setProducts(productData);
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError('An error occurred while fetching data. Please try again later.');
        if (error.message.includes('401')) {
          // Unauthorized, so log out the user
          signOut();
        }
      }
    };

    fetchData();
  }, [router, signOut]);

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5000/api/buyer/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.product.id === product.id);
        if (existingProduct) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { product, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      setError('Failed to add product to cart. Please try again.');
    }
  };

  const removeFromCart = async (product) => {
    try {
      const response = await fetch(`http://localhost:5000/api/buyer/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }

      setCart((prevCart) => prevCart.filter((item) => item.product.id !== product.id));
    } catch (error) {
      console.error('Error removing from cart:', error.message);
      setError('Failed to remove product from cart. Please try again.');
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    signOut();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="fixed top-4 right-[120px]">
        <button onClick={handleCartClick} className="relative">
          <svg
            className="w-8 h-8 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.4a2 2 0 002 2.6h10.4a2 2 0 002-2.6L17 13M7 13H5.4m11.6 0l-4 4m0 0l4 4m-4-4H3"
            />
          </svg>
          {totalQuantity > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="fixed top-3 right-[200px] max-w-md">
        <form action="" className="relative mx-auto w-max">
          <input
            type="search"
            className="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-lime-300 focus:pl-16 focus:pr-4"
            placeholder="Search..."
            value={searchQuery} // Bind searchQuery state to input value
            onChange={handleSearchChange} // Update searchQuery on input change
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-lime-300 peer-focus:stroke-lime-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      </div>
  



      <div className="p-[80px] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex justify-between items-center">
                    <span>
                      {item.quantity} x {item.product.name}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="ml-4 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default Buyer;
