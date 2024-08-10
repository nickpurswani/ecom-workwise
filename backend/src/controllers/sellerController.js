
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProduct =async (req, res) => {
  try {
    // Ensure the user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch products associated with the seller
    const products = await prisma.products.findMany({
      where: {
        seller_id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};
const addProduct = async (req, res) => {
  console.log(req.body)
  const { name, category, description } = req.body;
  const price=parseFloat(req.body.price);
  const discount=parseFloat(req.body.discount);
  const sellerId = req.user.id;
  if (req.user.role!=='seller'){
    return res.status(500).json({ message: 'Buyers cant add product' });
  }
  try {
    const product = await prisma.products.create({
      data: {
        name,
        category,
        description,
        price,
        discount,
        seller: {
          connect: { id: sellerId }, // Associate with existing seller
        },
      },
    });
    res.json(product);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'data entry wrong' });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description,  } = req.body;
  const price=parseFloat(req.body.price);
  const discount=parseFloat(req.body.discount);
  const sellerId = req.user.id;
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const product = await prisma.products.update({
      where: {
        id: parseInt(id),
        seller_id: sellerId, // Ensure the product belongs to the seller
      },
      data: {
        name,
        category,
        description,
        price,
        discount,
      },
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id;
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const product = await prisma.products.deleteMany({
      where: {
        id: parseInt(id),
        seller_id: sellerId, // Ensure the product belongs to the seller
      },
    });

    if (product.count === 0) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { getProduct, addProduct, editProduct, deleteProduct };
