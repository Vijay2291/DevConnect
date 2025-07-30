# DevConnect

A full-stack web application that allows users to create profiles, showcase personal projects, and receive feedback from other users.

---

## 🌐 Live Demo

- **Frontend:** https://dev-connect-one-pi.vercel.app/ 
- **Backend:** [[https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)](https://app.netlify.com/projects/quiet-travesseiro-f23492/deploys/688a2c392df92a380da56fb3)

---

## 📌 Features

- 🔐 User Authentication (Signup & Login)
- 👤 Profile Creation with Basic Information
- 📁 Project Posting (title, description, and relevant links)
- 💬 Comment/Feedback System on Projects
- 🔎 Search Users or Projects by Name
- 📱 Responsive and Clean UI

---

## 🛠 Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Hosting:** Netlify (Frontend), Render (Backend)

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devconnect.git
cd devconnect
```
cd backend
npm install

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

npm run dev

cd ../frontend
npm install
VITE_API_BASE_URL=http://localhost:5000/api
npm run dev

devconnect/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx


