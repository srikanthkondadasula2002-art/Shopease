import User from "../models/User.js";
import Product from "../models/Product.js";

export async function toggleWishlist(req, res, next) {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).json({message: "Product not found"});
    const hasProduct = req.user.wishlist.some(id => id.equals(product._id));
    const update = hasProduct ? {$pull: {wishlist: product._id}} : {$addToSet: {wishlist: product._id}};
    const user = await User.findByIdAndUpdate(req.user._id, update, {new: true});
    res.json({wishlist: user.wishlist});
  } catch (error) { next(error); }
}
