## 🛒 ShopNest – E-Commerce Platform

ShopNest is a full-stack **MERN** e-commerce platform designed for a modern, seamless online shopping experience. It empowers users to browse and buy products effortlessly while offering admin users full control over inventory, users, and orders.

## 🌐 **Live App:** [ShopNest on Vercel](https://shop-nest-mern-ff35.vercel.app/)

## 📸 Screenshots

<img src="https://github.com/user-attachments/assets/d63dbbde-40a6-496e-8bdc-f08a088fe862" width="600" height="auto" />
<img src="https://github.com/user-attachments/assets/5ee79824-2181-4a90-825a-a7eb7bf2cf46" width="600" height="auto" />
<img src="https://github.com/user-attachments/assets/ec7883a9-d59c-4c8d-97bd-5f3e337487dc" width="600" height="auto" />
<img src="https://github.com/user-attachments/assets/32bd4506-b971-4260-8df9-9030ee3d24aa" width="600" height="auto" />

---

## 🌟 Overview

ShopNest supports full e-commerce functionalities including user authentication, order management, product listings, wishlists, payment processing, and a rich admin dashboard. It features responsive design and integrates with Cloudinary and Razorpay.

---

## ✨ Features

👤 **For Users:**

* ✅ Register, login, and manage profile securely (JWT authentication)
* 🔍 Browse products by category, keyword, and filters (brand, price, etc.)
* 🛒 Add/remove items from cart and wishlist
* 📦 Place and track orders
* 💳 Checkout using Razorpay

🛠️ **For Admins:**

* 🔐 Role-based dashboard for managing users, products, and orders
* 📊 Analytics overview (sales, order history, inventory)
* ⚙️ Create, update, and delete product listings

🧪 **General Features:**

* ☁️ Cloudinary integration for image uploads
* 🔄 Debounced search to reduce API load
* 🖱️ Product zoom on hover
* 📱 Fully responsive layout (mobile/tablet/desktop)

---

## 🛠️ Tech Stack

| Category           | Technologies                                        |
| ------------------ | --------------------------------------------------- |
| **Frontend**       | React.js, Tailwind CSS, Redux Toolkit, React Router |
| **Backend**        | Node.js, Express.js, MongoDB, Mongoose              |
| **Authentication** | JWT (JSON Web Tokens)                               |
| **Payments**       | Razorpay                                            |
| **Image Storage**  | Cloudinary                                          |
| **Deployment**     | Vercel (Frontend & Backend)                         |

---

## 🔧 Installation & Setup

### ✅ Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* MongoDB (local or Atlas)
* Razorpay account
* Cloudinary account

---

### 📂 Clone the Repository

```bash
git clone https://github.com/ashishkrchy/shopnest-backend.git
cd shopnest
```

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
PORT=3000
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:

```bash
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` and add:

```
VITE_CLOUD_NAME_CLOUDINARY=your_cloudinary_cloud_name
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend server:

```bash
npm run dev
```

---

## 🔐 Authentication & Authorization

* 👥 **General Users:** Browse products, manage cart/wishlist, checkout, and track orders
* 🛠️ **Admins:** Access admin panel to manage users, products, orders, and analytics

---

## 🌐 Deployment

Both frontend and backend are deployed using **Vercel**:

```bash
vercel --prod
```

Add your environment variables in the Vercel project settings.

---

## 📁 Folder Structure

```
shopnest/
├── frontend/                # Frontend (React.js)
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # State management
│       ├── helpers/         # Utility functions
│       ├── pages/           # Page components (Home, Admin, etc.)
│       ├── assets/          # Media and images
│       └── styles/          # Tailwind config
├── backend/                 # Backend (Node.js/Express)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── controllers/         # Route logic
│   ├── middleware/          # Authentication & error handling
│   └── server.js            # App entry point
├── README.md                # This file
└── .gitignore               # Git ignore rules
```

---

## 📬 Contact

👨‍💻 Author: **Ashish Kumar Choudhary**
🔗 **GitHub:** [ashishkrchy](https://github.com/ashishkrchy)
💼 **LinkedIn:** [Ashish Kumar Choudhary](https://www.linkedin.com/in/ashishkrchy)

---

🛍️ Shop smarter, live better with **ShopNest**!
