# HalalLife Setup Guide (For Beginners)

🚀 Welcome to the **HalalLife** project! This guide will walk you through setting up the project on a new PC using **GitHub Desktop**, from forking and cloning the repository to running the backend and frontend.

---

## 📌 Step 1: Fork the Repository

1. Go to the **GitHub repository**: [https://github.com/YOUR_ORIGINAL_REPO](https://github.com/YOUR_ORIGINAL_REPO)
2. Click the **Fork** button (top right) to create a copy in your own GitHub account.
3. Navigate to your forked repository at `https://github.com/YOUR_USERNAME/halal-life`.

---

## 📌 Step 2: Clone the Repository with GitHub Desktop

### 🔹 Install GitHub Desktop (if you haven't already)

1. Download and install **GitHub Desktop** from [https://desktop.github.com/](https://desktop.github.com/).
2. Open GitHub Desktop and **sign in** to your GitHub account.

### 🔹 Clone Your Forked Repository

1. In **GitHub Desktop**, click **File → Clone Repository**.
2. Select **"Your repositories"** and choose `halal-life`.
3. Click **"Clone"** and select a local directory.

---

## 📌 Step 3: Set Up the Backend

### 🔹 Install Python (if you haven't already)

- Download and install **Python 3.9+** from [https://www.python.org/downloads/](https://www.python.org/downloads/).
- Verify installation:
  ```sh
  python --version
  ```

### 🔹 Create a Virtual Environment

```sh
cd backend
python -m venv venv
venv\Scripts\activate
```

### 🔹 Install Dependencies

```sh
pip install -r requirements.txt
```

### 🔹 Set Up Environment Variables

Create a **`.env` file** inside `backend/` with:

```
DATABASE_URL=mysql://username:password@localhost:3306/halal_life_db
FIREBASE_CREDENTIALS=./firebase-key.json
JWT_SECRET=supersecretkey
DEBUG=True
```

### 🔹 Run the Backend Server

```sh
uvicorn app.main:app --reload
```

- API available at **http://127.0.0.1:8000**
- **Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📌 Step 4: Set Up the Frontend

### 🔹 Install Node.js & npm (if you haven't already)

- Download and install **Node.js LTS** from [https://nodejs.org/](https://nodejs.org/).
- Verify installation:
  ```sh
  node -v
  npm -v
  ```

### 🔹 Install Dependencies

```sh
cd frontend
npm install
```

### 🔹 Run the Frontend (Expo React Native)

```sh
npm start
```

- or

```sh
npx expo start
```

- Scan the QR code with **Expo Go** (Android/iOS) to preview the app.

### 🔹 Using the Expo Go App

1. **Download Expo Go** from:
   - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Apple App Store (iOS)](https://apps.apple.com/us/app/expo-go/id982107779)
2. **Open the app** and **scan the QR code** displayed in your terminal when running `npm start`.
3. The app will launch on your mobile device without needing to install a separate build.
4. Changes made to the code will reflect automatically in real-time on your device.

---

## 📌 Step 5: CI/CD Automation & Code Quality

The project includes **GitHub Actions** to ensure code quality and consistency before merging changes.

### 🔹 PascalCase Naming Enforcement

- The CI/CD pipeline runs a **PascalCase naming check** to ensure that all function and class names follow proper naming conventions.
- If a function or class is incorrectly named, the pipeline will **fail** and provide feedback on what needs to be corrected.

### 🔹 Code Formatting

- **Prettier (Frontend)**: Ensures all JavaScript/TypeScript code is formatted correctly.
- **Black (Backend)**: Automatically formats Python code.
- CI/CD will **fail** if the code is not formatted properly, ensuring consistency across the project.

### 🔹 Linting & Type Checking

- **ESLint (Frontend)**: Identifies syntax and style errors in JavaScript/TypeScript.
- **Flake8 (Backend)**: Catches style issues and potential bugs in Python.
- **TypeScript Check**: Ensures proper type safety in the frontend.

### 🔹 Automated Testing

- The pipeline runs **Jest tests** (frontend) and **Pytest** (backend) to catch bugs early.
- If tests fail, the pipeline will block the pull request until issues are resolved.

<!-- ### 🔹 Docker & Kubernetes Deployment
- Upon merging changes to the `main` branch, the pipeline:
  1. Builds a **Docker image** for the backend.
  2. Pushes the image to **Docker Hub**.
  3. Deploys the backend to **Kubernetes** for production readiness. -->

---

<!-- ## 📌 Step 6: Run the Project with Docker (Optional)
If you prefer to use **Docker**, run:
```sh
docker-compose up --build
``` -->

---

## 📌 Step 7: Keeping Your Fork Updated

1. Open **GitHub Desktop**.
2. Click on **"Fetch origin"** to get the latest changes from your fork.
<!-- 3. If the original repository is updated, sync your fork by running:
   ```sh
   git remote add upstream https://github.com/YOUR_ORIGINAL_REPO.git
   git fetch upstream
   git merge upstream/main
   ``` -->

---

## 📌 Troubleshooting

- **Expo errors?** Try:
  ```sh
  expo doctor
  ```
- **Backend issues?** Check logs:
  ```sh
  tail -f backend/logs/error.log
  ```
- **Database connection problems?** Verify your `.env` file settings.

---

## 🚀 Your environment is now set up! Happy coding! 🎉
