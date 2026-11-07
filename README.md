# 🎓 CampusBazar - Peer-to-Peer Student Marketplace

**CampusBazar** is a showcase-ready, full-stack **MERN** web application built for school students, college students, and faculty to buy and sell used books, semester notes, drafting equipment, uniforms, laptops, and calculators directly from each other with **zero middleman commissions**.

Buyers and sellers connect instantly on campus via **WhatsApp chat**, **phone call**, or **in-app inquiries**.

---

## 🌟 Key Features

### 🔐 1. Authentication & Role-Based Profiles
- User registration with student roles: `college student`, `school student`, `other`.
- Secure password hashing using **bcryptjs** (salt rounds: 10).
- Stateless authentication using **JSON Web Tokens (JWT)** persisted in `localStorage`.
- Protected routes on client and token verification middleware on Express server.
- Profile management (edit name, contact number, campus location, role).

### 📦 2. Listings (Buy & Sell)
- Create listings with: title, description, category, subcategory / semester, condition (`Like New`, `Good`, `Fair`), price (₹), negotiable toggle, campus location, and up to 4 photos.
- Edit and delete own listings.
- Mark items as **"Sold"** or re-open them as **"Available"**.
- Dedicated **"My Listings"** seller dashboard with active vs. sold tabs and statistics.

### 🔍 3. Discovery & Multi-Filter Search
- Real-time keyword search across titles, descriptions, and branch subcategories.
- Multi-filter sidebar:
  - Filter by 9 campus categories
  - Filter by condition (`Like New`, `Good`, `Fair`)
  - Filter by price range (min/max ₹)
  - Filter by campus / city
  - Dynamic sorting (Newest, Price: Low to High, Price: High to Low, Oldest)
- Active filter pills with 1-click removal.
- Server-side pagination and responsive mobile drawer.

### 💬 4. Peer-to-Peer Contact & Inquiries
- **Direct WhatsApp Chat**: Automatically formats phone numbers into `https://wa.me/91<phone>?text=...` with a prefilled message containing the item title and price.
- **Direct Phone Call**: Instant `tel:<phone>` action button.
- **Privacy Protection for Guests**: Sensitive seller contact info is locked behind authentication to prevent web scraping and spam.
- **In-App Inquiries Inbox**: Buyers can leave messages directly on the platform; sellers receive them in an organized Inbox tab with 1-click WhatsApp/Call response buttons.

### ✨ 5. Extra Impressive Features
- **Wishlist**: 1-click save/bookmark with optimistic UI updates and dedicated Wishlist page.
- **Dark Mode**: Fully supported with light/dark toggle and persistence in `localStorage`.
- **Responsive Design**: Mobile-first design using Tailwind CSS with mobile drawer navigation.
- **Interactive UX**: Animated toast notifications, loading skeletons, and empty state illustrations.
- **1-Click Demo Logins**: Instant login buttons for examiners and demo showcases.

---

## 📚 Categories
1. **School Books** (NCERT / CBSE class-wise textbooks from Class 6 to 12)
2. **College Books** (B.Tech, BCA, B.Sc, B.Com branch-wise and semester-wise)
3. **Notes** (Topper handwritten notes, placement formulas, cheatsheets)
4. **Drawing Equipment** (Mini drafters, sheet tubes, compass boxes)
5. **School Uniform** (Blazers, shirts, trousers, lab aprons)
6. **Laptops and Computers** (Coding laptops, monitors, mechanical keyboards)
7. **Scientific Calculators** (Casio fx-991EX ClassWiz, 991ES, 82MS)
8. **Competitive Exam Books** (GATE CSE/ECE/ME, UPSC, JEE, NEET, SSC)
9. **Other** (Bed study tables, campus backpacks, bicycle, hostel items)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 (Vite) | Fast, modern component-based UI |
| **Styling** | Tailwind CSS | Mobile-first responsive styling with Dark Mode |
| **Icons** | Lucide React | Modern, lightweight icons |
| **Routing** | React Router v6 | Client-side routing with protected route wrappers |
| **HTTP Client**| Axios | API calls with JWT request interceptors |
| **State** | React Context API | Clean, centralized Auth, Theme, and Toast state |
| **Backend** | Node.js + Express.js | RESTful API server with modular controllers |
| **Database** | MongoDB + Mongoose | NoSQL database with schema validation & indexing |
| **Auth** | JWT + bcryptjs | Secure password hashing & stateless auth tokens |
| **Uploads** | Multer + Cloudinary | Local `/uploads` fallback + Cloudinary for cloud deploy |

---

## 📂 Project Directory Structure

```text
campusbazar/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── pages/              # Routed page views
│   │   │   ├── Home.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── CreateListing.jsx
│   │   │   ├── EditListing.jsx
│   │   │   ├── MyListings.jsx
│   │   │   ├── Inquiries.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/            # Context API state providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios instance configured with baseURL & JWT interceptor
│   │   ├── utils/
│   │   │   ├── constants.js    # Categories, conditions, student roles
│   │   │   └── formatters.js   # Currency (₹), relative time, WhatsApp URL helpers
│   │   ├── App.jsx             # Route definitions
│   │   ├── index.css           # Tailwind base styles & fonts
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/                     # Backend API (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection with automatic local/memory fallback
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User accounts & wishlist array
│   │   ├── Listing.js          # Marketplace items
│   │   └── Inquiry.js          # Messages between buyer and seller
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   ├── upload.js           # Multer file upload (Cloudinary + local disk storage)
│   │   └── errorHandler.js     # Centralized error handler
│   ├── controllers/            # Clean business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── listingController.js
│   │   ├── inquiryController.js
│   │   └── wishlistController.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── inquiryRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── healthRoutes.js
│   ├── uploads/                # Local storage directory for uploaded files
│   ├── seed.js                 # Database seeder (2 users + 21 realistic items)
│   ├── test-api.js             # Automated API integration test suite
│   ├── server.js               # Express application entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── README.md                   # Complete documentation & viva answers
└── DEPLOYMENT.md               # Production deployment guide (Render + Vercel)
```

---

## 🚀 Quickstart: Local Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node)
- *(Optional)* [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free MongoDB Atlas connection string. (Note: An embedded in-memory MongoDB is automatically included so you can run and test right out-of-the-box!)

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd campusbazar/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Populate database with 21 realistic listings and demo users:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm start
   ```
   *The backend will start listening at `http://localhost:5000`*.

### 3. Frontend Setup
1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd campusbazar/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env` file exists:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Login Credentials

For testing and examination demos, 2 pre-configured student accounts are seeded into the database:

| Name | Role | Email | Password |
|---|---|---|---|
| **Rahul Sharma** | College Student | `rahul@campusbazar.com` | `password123` |
| **Priya Patel** | College Student | `priya@campusbazar.com` | `password123` |
| **Aman Verma** | School Student | `aman@campusbazar.com` | `password123` |

*(Tip: The Login page features 1-click demo buttons that pre-fill and sign in immediately!)*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server uptime and MongoDB connection health check |
| `POST` | `/api/auth/register` | Public | Register new student account (returns JWT) |
| `POST` | `/api/auth/login` | Public | Authenticate user with email and password |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile with populated wishlist |
| `PUT` | `/api/users/profile` | Private | Update user's name, phone, city, or student role |
| `GET` | `/api/listings` | Public | Query listings (search `q`, `category`, `price`, `condition`, `city`, `sort`, `page`) |
| `GET` | `/api/listings/:id` | Public | Fetch single listing details with populated seller info |
| `GET` | `/api/listings/mine` | Private | Fetch all listings created by the logged-in user |
| `POST` | `/api/listings` | Private | Create new listing (accepts up to 4 multipart image files) |
| `PUT` | `/api/listings/:id` | Private (Owner) | Update listing details or replace images |
| `DELETE` | `/api/listings/:id` | Private (Owner) | Delete a listing |
| `PATCH` | `/api/listings/:id/sold` | Private (Owner) | Toggle `isSold` status between true and false |
| `POST` | `/api/inquiries` | Private | Send a message to the seller of an item |
| `GET` | `/api/inquiries/received` | Private | Get inquiries sent to the logged-in seller (Inbox) |
| `GET` | `/api/inquiries/sent` | Private | Get inquiries sent by the logged-in buyer |
| `POST` | `/api/wishlist/:id` | Private | Toggle listing bookmark in user wishlist |
| `GET` | `/api/wishlist` | Private | Retrieve all bookmarked listings for the user |

---

## 🧪 Testing the Backend API

To run the automated integration test suite that tests all 16 endpoints:

```bash
cd campusbazar/server
npm test
```

Expected output:
```text
✅ PASS: GET /api/health returns 200 and healthy status
✅ PASS: POST /api/auth/register registers new user and returns JWT
✅ PASS: POST /api/auth/login authenticates user
✅ PASS: GET /api/auth/me returns current user details
✅ PASS: PUT /api/users/profile updates profile
✅ PASS: POST /api/listings creates new listing
✅ PASS: GET /api/listings supports search, category, sort and returns array
✅ PASS: GET /api/listings/:id returns listing with seller
✅ PASS: PUT /api/listings/:id updates listing
✅ PASS: PATCH /api/listings/:id/sold toggles isSold status
✅ PASS: GET /api/listings/mine returns user listings
✅ PASS: POST /api/wishlist/:id adds item to wishlist
✅ PASS: GET /api/wishlist returns populated wishlist
✅ PASS: POST /api/inquiries sends inquiry to seller
✅ PASS: GET /api/inquiries/received returns inquiries in seller inbox
✅ PASS: DELETE /api/listings/:id removes listing
🎯 TEST RESULTS: 16 Passed, 0 Failed
```

---

## 🎓 Viva / Interview Preparation Guide: How the MERN Stack Connects

When explaining this project to professors, examiners, or technical interviewers, use this step-by-step breakdown:

### 1. The High-Level Architecture Flow
```text
[ React Frontend (Vite) ]  <--(HTTP/JSON via Axios)-->  [ Express.js REST API ]  <--(Mongoose ODM)-->  [ MongoDB Database ]
    - Browser Client                                      - Controllers & Routes                          - Collections (Users, Listings, Inquiries)
    - Context API State                                   - JWT Auth Middleware
    - Tailwind CSS Styling                                - Multer / Cloudinary
```

1. **User Interaction on Frontend**: When a student performs an action (e.g. types a search term, clicks "Sell Item", or clicks "Chat on WhatsApp"), React triggers an event handler.
2. **Axios HTTP Request**: The client dispatches an HTTP request via the central Axios client (`client/src/services/api.js`). If the user is logged in, an Axios **request interceptor** automatically attaches the JWT token from `localStorage` in the `Authorization: Bearer <token>` header.
3. **Express Server & Routing**: The Express server (`server/server.js`) receives the incoming request:
   - CORS middleware checks if the origin is authorized (`http://localhost:5173` or production domain).
   - JSON body parser parses incoming payloads.
   - The request is matched against modular routes (`/api/auth`, `/api/listings`, etc.).
4. **Middleware Validation**:
   - For protected routes, `middleware/auth.js` intercepts the request, verifies the JWT using the secret key, decodes the user's ID, and attaches the user document to `req.user`.
   - For image uploads, `middleware/upload.js` intercepts multipart form data, validates file formats and sizes, and writes the files either to local disk or Cloudinary.
5. **Controller & Mongoose Queries**: The matching controller executes business logic and interacts with MongoDB using **Mongoose Models** (`Listing.find()`, `User.create()`, etc.).
6. **Database Response**: MongoDB returns the documents (with indexed text search and relations resolved via `.populate('seller')`).
7. **JSON Response**: Express returns a standardized JSON response:
   ```json
   { "success": true, "listings": [...], "total": 21 }
   ```
8. **React State Update & Re-render**: React receives the JSON data, updates the local state or Context API (`AuthContext`), and smoothly re-renders the UI components without page reload.

---

### 2. Common Viva / Interview Questions & Answers

#### Q1: Why did you use JWT instead of traditional server-side sessions?
> **Answer:** JWT is **stateless**. The server doesn't need to store session IDs in memory or a Redis cache. The client stores the signed token in `localStorage`, and the server simply verifies the mathematical cryptographic signature with `process.env.JWT_SECRET`. This makes the backend much easier to scale across multiple instances on cloud providers like Render.

#### Q2: How does search and filtering work without crashing performance?
> **Answer:** We created a compound text index in MongoDB (`title`, `description`, `subCategory`) and an index on `{ category: 1, price: 1, isSold: 1, createdAt: -1 }`. When a user filters, the controller dynamically constructs a MongoDB query object (`$or` with regex, `$gte`, `$lte`), and applies pagination with `.skip()` and `.limit()` so that only a dozen items are transmitted over the network at a time.

#### Q3: How do you handle images on production versus local development?
> **Answer:** In local development, Multer saves images directly to the `server/uploads/` directory and Express serves them statically via `express.static()`. For production (Render), ephemeral server disks get wiped on every restart; therefore, `middleware/upload.js` checks for Cloudinary environment variables and automatically switches to `multer-storage-cloudinary` to store photos in the cloud permanently.

#### Q4: Why is React Context API used instead of Redux?
> **Answer:** CampusBazar's state requirements are focused: user authentication, dark mode preference, and temporary toast notifications. Redux would introduce unnecessary boilerplate and package size. React's native Context API + Hooks (`useContext`, `useState`, `useEffect`) provides clean, predictable state management with zero external dependencies.

---

## 📄 License
This project is open-source and built for student learning and portfolio demonstration. Feel free to fork and customize for your campus!
