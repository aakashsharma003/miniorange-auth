# 🔧 Miniorange Auth System (React + Vite + Node.js + MongoDB)

A fullstack authentication system built with **React (Vite)** frontend and **Node.js + Express** backend with **MongoDB**.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aakashsharma003/miniorange-auth.git
cd miniorange-auth
```

---

## 🖥️ Frontend Setup (React + Vite)

### 📦 Install Dependencies

```bash
cd frontend
npm install
```

### 🛠️ Environment Variables

Create a `.env` file inside the `frontend/` folder:

```env
VITE_APP_BACKEND_API=http://localhost:5000
```

### ▶️ Run Frontend

```bash
pnpm run dev
```

The frontend will run on: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Backend Setup (Node.js + Express)

### 📦 Install Dependencies

```bash
cd backend
npm install
```

### 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder and add:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

> 🔑 Replace secrets and credentials with your actual values.

### ▶️ Run Backend

```bash
node server.js
```

The backend will run on: [http://localhost:5000](http://localhost:5000)

---

## ✅ Features

* JWT & Refresh Token Authentication
* Google & Facebook OAuth
* Secure `.env` usage
* Fully functional frontend + backend integration

---

## 📎 License

MIT


