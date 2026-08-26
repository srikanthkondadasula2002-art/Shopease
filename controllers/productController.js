import Product from "../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    const {search, category, sort = "featured"} = req.query;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    if (search) filter.$or = [{title: {$regex: search, $options: "i"}}, {description: {$regex: search, $options: "i"}}];
    if (category && category !== "all") filter.category = category;
    const sortMap = {rating: {rating: -1}, "price-low": {price: 1}, "price-high": {price: -1}, featured: {createdAt: -1}};
    const [products, total] = await Promise.all([Product.find(filter).sort(sortMap[sort] || sortMap.featured).skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]);
    res.json({products, page, pages: Math.ceil(total / limit), total});
  } catch (error) { next(error); }
}

export async function getProduct(req, res, next) {
  try { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({message: "Product not found"}); res.json(product); } catch (error) { next(error); }
}

export async function createProduct(req, res, next) {
  try { res.status(201).json(await Product.create(req.body)); } catch (error) { next(error); }
}
