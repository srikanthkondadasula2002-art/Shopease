import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res, next) {
  try {
    const {orderItems, shippingAddress, paymentMethod} = req.body;
    if (!orderItems?.length || !shippingAddress || !paymentMethod) return res.status(400).json({message: "Order items, shipping address, and payment method are required"});
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({_id: {$in: productIds}});
    const productMap = new Map(products.map(product => [product._id.toString(), product]));
    const normalizedItems = orderItems.map(item => {
      const product = productMap.get(item.product);
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || product.stock < item.quantity) throw Object.assign(new Error("A product is unavailable or has insufficient stock"), {statusCode: 400});
      return {product: product._id, quantity: item.quantity, price: product.price};
    });
    const totalPrice = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const order = await Order.create({user: req.user._id, orderItems: normalizedItems, shippingAddress, paymentMethod, totalPrice, isPaid: paymentMethod === "card", paidAt: paymentMethod === "card" ? new Date() : undefined, paymentResult: paymentMethod === "card" ? {status: "paid"} : undefined});
    await Promise.all(normalizedItems.map(item => Product.findByIdAndUpdate(item.product, {$inc: {stock: -item.quantity}})));
    res.status(201).json(order);
  } catch (error) { next(error); }
}

export async function myOrders(req, res, next) {
  try { res.json(await Order.find({user: req.user._id}).populate("orderItems.product").sort({createdAt: -1})); } catch (error) { next(error); }
}
