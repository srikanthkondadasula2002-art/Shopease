# ShopEase

ShopEase is a responsive React + Vite e-commerce portfolio project with a curated product catalog, persistent cart, wishlist, product details, and a complete demo checkout journey.

## Features

- REST product data from DummyJSON with local fallback and retryable API-error state
- Product search, category filters, and featured, rating, and price sorting
- Product detail modal with description and add-to-bag action
- Wishlist toggle and wishlist-only view
- Shopping bag with quantity controls, remove actions, subtotal, and total
- Cart and wishlist persistence with `localStorage`
- Responsive mobile navigation and layouts
- Validated delivery and payment form
- Order confirmation state after demo payment submission
- Reusable React components in `src/components.jsx`

## Getting started

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## API and payments

The catalog loads from `https://dummyjson.com/products?limit=40`. If that request fails, ShopEase displays the fallback collection and an API warning state with a retry action.

Checkout is intentionally a front-end demo for portfolio use. It validates delivery and payment fields but does not send card data to a payment provider or charge a real card. A production deployment should connect the checkout form to a PCI-compliant payment service and server-side order API.

## Project structure

- `src/main.jsx`: application state, persistence, data loading, and composition
- `src/components.jsx`: reusable storefront, cart, product, checkout, and feedback components
- `src/styles.css`: responsive visual system and component styles
- `public/`: static public assets

## Backend API

The project also includes an Express/Mongoose REST API. Copy `.env.example` to `.env`, set `MONGO_URI` and a strong `JWT_SECRET`, then run:

```bash
npm run server
```

The API listens on `http://localhost:5000` by default. Its MVC structure is:

```text
config/db.js
controllers/       auth, products, users, orders
middleware/        JWT authorization and error handling
models/            User, Product, Order
routes/            auth, products, users, orders
server.js
```

Available endpoints include authentication (`/api/auth`), searchable and paginated products (`/api/products`), authenticated wishlist toggling (`/api/user/wishlist`), and authenticated order creation/history (`/api/orders`). Product creation requires a user with the `admin` role.
