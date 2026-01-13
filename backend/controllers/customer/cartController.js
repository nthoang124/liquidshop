const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel')

const calculateTotal = (cart) => {
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  if (quantity <= 0) {
    return res.status(403).json({
      message: "Quantity invalid",
    });
  }

  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const name = product.name
    const price = product.price
    const image = product.images[0]
    const sku = product.sku

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, name, sku, price, image, quantity }]
      });
    }
    else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, sku, price, image, quantity });
      }
    }

    calculateTotal(cart);
    await cart.save();

    res.status(200).json({
      message: "Add cart successful",
      cart
    });

  } catch (error) {
    res.status(500).json({
      message: "Add cart error",
      error: error
    });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartData = await Cart.findOne({ userId }).lean();
    if (!cartData) {
      return res.status(404).json({
        message: "Cart empty"
      });
    }

    for (let item of cartData.items) {
      const product = await Product.findById(item.productId).lean();
      if (product) {
        item.stockQuantity = product.stockQuantity;
      } else {
        item.stockQuantity = 0;
      }
    }

    const cart = {
      ...cartData,
      items: cartData.items
    };

    res.status(200).json({
      message: 'Get cart successful',
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Get cart error",
      error: error
    });
  }
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart empty"
      });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      calculateTotal(cart);
      await cart.save();
      res.status(200).json({
        message: "Update cart item successful",
        cart
      });

    } else {
      res.status(404).json({
        message: "Item is not in the cart"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Update cart item error",
      error: error
    });
  }
};

const removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart empty"
      });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    calculateTotal(cart);
    await cart.save();

    res.status(200).json({
      message: "Delete cart item successfull",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete cart item error",
      error: error
    });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem }