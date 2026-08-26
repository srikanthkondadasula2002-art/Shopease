import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";
import {Benefits, CartDrawer, Checkout, Header, Hero, ProductModal, Shop, Success} from "./components";

const API = "https://dummyjson.com/products";
const FALLBACK = [
  {id:1,title:"Premium Wireless Headphones",price:129,discountPercentage:15,rating:4.8,category:"audio",thumbnail:"https://dummyjson.com/image/600x600/111827/ffffff&text=Headphones",description:"Rich sound, comfortable ear cushions and reliable wireless listening for everyday use."},
  {id:2,title:"Minimal Leather Backpack",price:89,discountPercentage:10,rating:4.7,category:"bags",thumbnail:"https://dummyjson.com/image/600x600/1f2937/ffffff&text=Backpack",description:"A durable, minimal carry-all designed for workdays, weekends and everything between."},
  {id:3,title:"Smart Fitness Watch",price:149,discountPercentage:18,rating:4.6,category:"wearables",thumbnail:"https://dummyjson.com/image/600x600/334155/ffffff&text=Watch",description:"Stay connected to your movement, routines and daily goals with a clean, focused display."},
  {id:4,title:"Everyday Running Shoes",price:99,discountPercentage:12,rating:4.9,category:"shoes",thumbnail:"https://dummyjson.com/image/600x600/475569/ffffff&text=Shoes",description:"Lightweight comfort and everyday grip for morning miles and city walks."}
];

function readStorage(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }

function App() {
  const [products,setProducts] = useState([]), [query,setQuery] = useState(""), [category,setCategory] = useState("all"), [sort,setSort] = useState("featured");
  const [cart,setCart] = useState(()=>readStorage("shopease-cart",[])), [wish,setWish] = useState(()=>readStorage("shopease-wishlist",[]));
  const [drawer,setDrawer] = useState(false), [checkout,setCheckout] = useState(false), [orderComplete,setOrderComplete] = useState(false), [mobile,setMobile] = useState(false), [wishlistOnly,setWishlistOnly] = useState(false), [selectedProduct,setSelectedProduct] = useState(null), [loading,setLoading] = useState(true), [error,setError] = useState(false);

  const loadProducts = () => { setLoading(true); setError(false); fetch(`${API}?limit=40`).then(response=>{if(!response.ok) throw new Error("API request failed"); return response.json();}).then(data=>setProducts(data.products?.length?data.products:FALLBACK)).catch(()=>{setProducts(FALLBACK);setError(true);}).finally(()=>setLoading(false)); };
  useEffect(()=>{loadProducts();},[]);
  useEffect(()=>{localStorage.setItem("shopease-cart",JSON.stringify(cart));},[cart]);
  useEffect(()=>{localStorage.setItem("shopease-wishlist",JSON.stringify(wish));},[wish]);

  const cats = useMemo(()=>["all",...new Set(products.map(product=>product.category))],[products]);
  const visibleProducts = useMemo(()=>{let result=products.filter(product=>(category==="all"||product.category===category)&&(!wishlistOnly||wish.includes(product.id))&&product.title.toLowerCase().includes(query.toLowerCase())); if(sort==="price-low")result.sort((a,b)=>a.price-b.price); if(sort==="price-high")result.sort((a,b)=>b.price-a.price); if(sort==="rating")result.sort((a,b)=>b.rating-a.rating); return result;},[products,query,category,sort,wishlistOnly,wish]);
  const count = cart.reduce((sum,product)=>sum+product.qty,0), total = cart.reduce((sum,product)=>sum+product.price*product.qty,0);
  const goTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const add = product => setCart(current=>{const existing=current.find(item=>item.id===product.id); return existing?current.map(item=>item.id===product.id?{...item,qty:item.qty+1}:item):[...current,{...product,qty:1}];});
  const update = (id,delta) => setCart(current=>current.map(item=>item.id===id?{...item,qty:item.qty+delta}:item).filter(item=>item.qty>0));
  const remove = id => setCart(current=>current.filter(item=>item.id!==id));
  const toggleWish = id => setWish(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
  const beginCheckout = () => {if(cart.length){setDrawer(false);setCheckout(true);}};
  const completeOrder = event => {event.preventDefault();setCheckout(false);setOrderComplete(true);setCart([]);};

  return <div className="app"><Header query={query} setQuery={setQuery} mobile={mobile} setMobile={setMobile} wishlistOnly={wishlistOnly} setWishlistOnly={setWishlistOnly} wishCount={wish.length} cartCount={count} setDrawer={setDrawer}/><Hero goTo={goTo}/><Benefits/><Shop products={visibleProducts} loading={loading} error={error} retry={loadProducts} cats={cats} category={category} setCategory={setCategory} sort={sort} setSort={setSort} query={query} wish={wish} onWish={toggleWish} onAdd={add} onDetails={setSelectedProduct} wishlistOnly={wishlistOnly}/><section id="about" className="about"><div className="aboutImage"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85" alt="ShopEase essentials arranged for everyday living"/></div><div className="aboutContent"><span>02 / ABOUT SHOP EASE</span><h2>A portfolio project that feels like a real product.</h2><p>ShopEase demonstrates responsive React UI, REST API integration, search, filtering, sorting, wishlist interactions, cart persistence and a checkout-ready experience.</p><div className="tech"><span>React.js</span><span>JavaScript</span><span>REST API</span><span>Responsive UI</span><span>Local storage</span></div></div></section><footer><div><button className="logo logoButton" onClick={()=>goTo("top")}><span>Shop</span>Ease</button><p>Modern commerce experience built with React.js.</p></div><div><strong>Project stack</strong><p>React · Vite · REST API · Lucide</p></div><div><strong>Portfolio</strong><p>Built by Srikanth</p></div></footer>{drawer&&<CartDrawer cart={cart} total={total} setDrawer={setDrawer} update={update} remove={remove} beginCheckout={beginCheckout}/>}<ProductModal product={selectedProduct} onClose={()=>setSelectedProduct(null)} onAdd={add}/>{checkout&&<Checkout cart={cart} total={total} onClose={()=>setCheckout(false)} onComplete={completeOrder}/>} {orderComplete&&<Success onClose={()=>setOrderComplete(false)}/>}</div>;
}

createRoot(document.getElementById("root")).render(<App/>);
