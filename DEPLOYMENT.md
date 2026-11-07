# 🚀 CampusBazar Deployment Guide

This guide provides step-by-step production deployment instructions for **CampusBazar** using **Render** (for Express Backend + MongoDB Atlas + Cloudinary) and **Vercel** (for React + Vite Frontend).

---

## 🗄️ Step 1: Set Up Free MongoDB Atlas Database

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a Deployment** and select the **M0 Free Cluster**.
3. Under **Security Quickstart**:
   - Create a database user with username (e.g. `campus_admin`) and a secure password.
   - Under **Where would you like to connect from?**, select **Network Access** and add `0.0.0.0/0` (Allow access from anywhere, required for Render).
4. Click **Connect** → Choose **Drivers (Node.js)**.
5. Copy the connection string:
   ```env
   mongodb+srv://campus_admin:<password>@cluster0.xxxxx.mongodb.net/campusbazar?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password)*.

---

## ☁️ Step 2: Set Up Free Cloudinary (For Image Uploads on Render)

Because Render free tier instances wipe local disk files on sleep/restart, Cloudinary ensures all uploaded student photos persist permanently.

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **API Credentials**:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

---

## 🖥️ Step 3: Deploy Backend to Render

1. Push your project to a GitHub repository.
2. Sign in to [Render](https://render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `campusbazar-api`
   - **Region**: Closest to your users (e.g. Singapore or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll down to **Environment Variables** and add the following keys:

   | Key | Example Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `10000` | Render assigns this or uses default |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `your_random_super_secure_jwt_secret_key` | Secret key for JWT auth |
   | `CLIENT_URL` | `https://campusbazar.vercel.app` | Your Vercel frontend URL (from Step 4) |
   | `CLOUDINARY_CLOUD_NAME`| `your_cloud_name` | Cloudinary Cloud Name |
   | `CLOUDINARY_API_KEY` | `your_api_key` | Cloudinary API Key |
   | `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary API Secret |

6. Click **Create Web Service**.
7. Once deployed, note your live backend URL (e.g. `https://campusbazar-api.onrender.com`).
8. You can verify it by opening `https://campusbazar-api.onrender.com/api/health` in your browser. It should return:
   ```json
   { "status": "healthy", "message": "CampusBazar API is running smoothly", "database": "connected" }
   ```

*(Optional: To populate initial demo data on Render, open the Render **Shell** tab and run `npm run seed`).*

---

## 🌐 Step 4: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://campusbazar-api.onrender.com/api` | The Render backend URL with `/api` suffix |

5. Click **Deploy**.
6. When deployment finishes, copy your live frontend URL (e.g. `https://campusbazar.vercel.app`).
7. Go back to Render **Environment Variables** and ensure `CLIENT_URL` matches your live Vercel domain to permit CORS requests.

---

## 🧪 Step 5: Post-Deployment Smoke Test Checklist

- [ ] Open frontend URL on desktop and mobile.
- [ ] Sign in using demo account `rahul@campusbazar.com` / `password123`.
- [ ] Post a new test listing with an image.
- [ ] Verify image loads correctly from Cloudinary.
- [ ] Click **Chat on WhatsApp** to verify phone prefill message opens properly.
- [ ] Log out and verify contact protection displays for guests.
