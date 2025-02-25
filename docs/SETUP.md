# Setup Instructions

## 🚀 Backend Setup (FastAPI)

### 1️⃣ Clone Repository

```sh
git clone https://github.com/your-username/halal-life.git
cd halal-life/backend
```

### 2️⃣ Create Virtual Environment

```sh
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate    # Windows
```

### 3️⃣ Install Dependencies

```sh
pip install -r requirements.txt
```

### 4️⃣ Configure `.env`

Create a `.env` file in `backend/` with:

```
DATABASE_URL=mysql://username:password@localhost:3306/halal_life_db
FIREBASE_CREDENTIALS=./firebase-key.json
JWT_SECRET=supersecretkey
DEBUG=True
```

### 5️⃣ Run FastAPI Server

```sh
uvicorn app.main:app --reload
```

---

## 🚀 Frontend Setup (React Native)

### 1️⃣ Navigate to Frontend Directory

```sh
cd ../frontend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Start Development Server

```sh
npm start
```

- Scan the QR code with Expo Go (iOS/Android) to run the app.

---

## 🐳 Running with Docker

```sh
docker-compose up --build
```
