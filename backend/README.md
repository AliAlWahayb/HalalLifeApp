# HalalLife Backend

🚀 Welcome to the **HalalLife Backend**! This repository contains the **FastAPI backend** for the HalalLife application.

---

## 📌 Setup Instructions

### 🔹 1. Clone the Repository

Fork and clone the repository:

```sh
git clone https://github.com/YOUR_USERNAME/halal-life.git
cd halal-life/backend
```

### 🔹 2. Create a Virtual Environment

```sh
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### 🔹 3. Install Dependencies

```sh
pip install -r requirements.txt
```

### 🔹 4. Configure Environment Variables

Create a `.env` file in `backend/` with:

```sh
DATABASE_URL=mysql://username:password@localhost:3306/halal_life_db
FIREBASE_CREDENTIALS=./firebase-key.json
JWT_SECRET=supersecretkey
DEBUG=True
```

### 🔹 5. Run FastAPI Server

```sh
uvicorn app.main:app --reload
```

- API available at **http://127.0.0.1:8000**
- **Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 🔹 6. Run with Docker

```sh
docker build -t halal-life-backend .
docker run -d -p 8000:8000 halal-life-backend
```

---

## 📌 Features

- 🚀 **FastAPI** for high-performance API development
- 🗄️ **MySQL & Firebase Firestore** for hybrid database management
- 🔑 **JWT Authentication** for secure user login
- 🐳 **Dockerized Deployment** for easier scaling
- ☁ **Kubernetes Ready** for cloud deployment

---

## 📜 API Endpoints

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | `/`            | Health check              |
| POST   | `/auth/login`  | User login with JWT       |
| POST   | `/auth/signup` | User registration         |
| GET    | `/products`    | Get halal product details |
| GET    | `/restaurants` | Locate halal restaurants  |

---

## 📌 Contributing

Contributions are welcome! Follow these steps:

1. **Fork this repository**.
2. **Create a feature branch** (`feature/new-feature`).
3. **Commit & push changes**.
4. **Open a Pull Request (PR)**.

---

## 📌 License

This project is licensed under **MIT License**.

🚀 **Happy coding!**
