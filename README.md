****************************************************   ShopNest - E-Commerce Platform    **************************************************************************************
  Welcome to ShopNest – a full-stack e-commerce platform designed for seamless online shopping experiences. Built
  with the MERN stack, ShopNest provides a robust, scalable solution for managing products, orders, and users,
  offering a modern and user-friendly interface.

🌟 Overview
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

ShopNest is an e-commerce application that empowers users to browse, purchase, and track products effortlessly,
while admins can manage users, products, orders, and analytics. With secure authentication, Razorpay payment
integration, and Cloudinary for optimized images, ShopNest delivers a high-performance shopping experience
for both users and administrators.


✨ Features
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  User Features:
  
      ✅ User registration, login, and profile management with JWT authentication.
      
      🔍 Product browsing by category, search, and filters (price, brand, sort).
      
      🛒 Shopping cart, wishlist, and order tracking.
      
      💳 Secure Razorpay payment integration for checkout.
      
      📱 Responsive design for mobile, tablet, and desktop views.

  Admin Features:
  
      🔐 Role-based access control for admin users.
      
      ⚙️ Manage users, products, and orders via an admin panel.
      
      📊 Analytics dashboard for tracking sales and performance.

  Technical Highlights:

      📷 Optimized image storage using Cloudinary for fast product rendering.
      
      🔄 Debouncing for search functionality to reduce API calls and improve efficiency.
      
      🔍 Zooming effect on product hover for an interactive shopping experience.
      
      🎨 Light, modern UI with Tailwind CSS, optimized for performance.

🛠️ Tech Stack
------------------------------------------------------------------------------------------------------------------------------------------------------------------

       Category                                  Technologies
    ---------------                            -----------------               

      Frontend                    React.js, Tailwind CSS, Redux Toolkit, React Router

      Backend                          Node.js, Express.js, MongoDB, Mongoose

     Authentication                            JWT (JSON Web Tokens)

      Payments                                        Razorpay

    Image Management                                 Cloudinary

      Deployment                             Vercel (Frontend & Backend)
      

  🔧 Installation & Setup
----------------------------------------------------------------------------------------------------------------------------------------------------------------

Follow these steps to set up and run ShopNest locally:

  ****************  Prerequisites  *****************
  
      ✅ Node.js (v14.x or higher)
      
      ✅ npm or yarn
      
      ✅ MongoDB (local or cloud instance, e.g., MongoDB Atlas)
      
      ✅ Razorpay Account (for payment integration)
      
      ✅ Cloudinary Account (for image storage)


 *****************  Clone the Repository   **************
 
        git clone https://github.com/ashishkrchy/shopnest-backend.git

  *****************  Backend Setup  *********************

          cd backend
      
      Install Dependencies
      
          npm install
      
      Configure Environment Variables
      
          Create a .env file in the root directory and add:
          
          MONGO_URI=your_mongodb_connection_string
          JWT_SECRET_KEY=your_jwt_secret_key
          PORT=3000
          FRONTEND_URL=http://localhost:5173
          RAZORPAY_KEY_ID=your_razorpay_key_id
          RAZORPAY_KEY_SECRET=your_razorpay_key_secret
      
          Replace the placeholders with your actual credentials. Ensure these values are not
          committed to version control; add .env to .gitignore.
      
      Start the Backend Server
      
          npm run dev

  ********************  Frontend Setup  *********************************
      
        cd frontend
      
      Install Dependencies
        
        npm install
      
      Configure Environment Variables
      
        Create a .env file in the root directory and add:
        
        VITE_CLOUD_NAME_CLOUDINARY=your_cloudinary_cloud_name
        VITE_BACKEND_URL=http://localhost:3000
        VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
        
        Replace the placeholders with your actual credentials. Ensure these values are not committed to
        version control.
      
      Start the Frontend Server
      
          npm run dev

🔐 Authentication & Authorization
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    👥 General Users can browse products, add to cart, manage wishlists, and place orders.
    
    🛠️ Admin Users have exclusive access to manage users, products, orders, and view analytics via the admin panel.

🌐 Deployment
------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Both the frontend and backend are deployed on Vercel for production use:
    
    Frontend Deployment:
    
        vercel --prod
    
    Backend Deployment:
    
        vercel --prod
    
    Ensure environment variables are configured in Vercel for production deployment (use Vercel’s environment variable
    settings instead of committing .env files).

📂 Folder Structure
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

        shopnest/
        ├── frontend/                # Frontend (React)
        │   ├── public/              # Static assets (index.html, favicon, etc.)
        │   ├── src/
        │   │   ├── components/      # Reusable UI components
        │   │   ├── context/         # Context API for state management
        │   │   ├── helpers/         # Utility functions
        │   │   ├── pages/           # Page components (e.g., Home, Profile, AdminPanel)
        │   │   ├── assets/          # Images and media
        │   │   ├── App.jsx          # Main React app entry
        │   │   ├── main.jsx         # React DOM rendering
        │   │   └── styles/          # Tailwind CSS configuration
        ├── backend/                 # Backend (Node.js/Express)
        │   ├── models/              # Mongoose schemas
        │   ├── routes/              # API routes
        │   ├── controllers/         # Business logic
        │   ├── middleware/          # Middleware
        │   ├── server.js            # Main backend entry
        ├── README.md                # This file
        ├── .gitignore               # Git ignore file
        └── package.json             # Project dependencies


📧 Contact

     Author: Ashish Kumar Choudhary
    
    📩 Email: ashishchy862003@gmail.com
    
    🏗️ GitHub: GitHub Profile
    
    💼 LinkedIn: LinkedIn Profile
    
🎉 Enjoy shopping with ShopNest! 🛒🔥

