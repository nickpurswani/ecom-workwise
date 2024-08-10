const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products
const getAllProducts = async (req, res) => {
  console.log(req.user)
  if (req.user.role !== 'buyer') {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

// Add product to cart
const addProductToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  if (req.user.role !== 'buyer') {
    return res.status(401).json({ error: 'Access denied' });
  }
  const user_id = req.user.id;
console.log(user_id,product_id,quantity)
  if(req.user.role!='buyer'){
    return res.status(401).json({ message: 'seller cant add product to cart' });
}
  try {
    // Check if product exists
    const product = await prisma.products.findUnique({
      where: { id: product_id },
    });
console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add or update cart item
    const cartItem = await prisma.carts.upsert({
      where: {
        user_id_product_id: { user_id, product_id }, // Composite unique key
      },
      update: {
        quantity: { increment: quantity }, // Update quantity if already exists
      },
      create: {
        user_id,
        product_id,
        quantity,
      },
    });

    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product to cart' });
  }
};

// Get all products in cart
const getCartItems = async (req, res) => {
  const userId = req.user.id;
  if (req.user.role !== 'buyer') {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const cartItems = await prisma.carts.findMany({
      where: { user_id:userId },
      include: {
        product: true, // Include product details
      },
    });

    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve cart items' });
  }
};

// Remove product from cart
const removeProductFromCart = async (req, res) => {
  const { product_id } = req.body;
  if (req.user.role !== 'buyer') {
    return res.status(401).json({ error: 'Access denied' });
  }
  const userId = req.user.id;

  try {
    const cartItem = await prisma.carts.deleteMany({
      where: {
        user_id:userId,
        product_id: parseInt(product_id),
      },
    });

    if (cartItem.count === 0) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove product from cart' });
  }
};

module.exports = {
  getAllProducts,
  addProductToCart,
  getCartItems,
  removeProductFromCart,
};
