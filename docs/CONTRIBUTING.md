# Contributing to HalalLife

Thank you for your interest in contributing to **HalalLife**! 🚀

This document provides guidelines on how to **contribute** to the project, including coding standards, branching strategy, and how to submit changes effectively.

---

## 📌 How to Contribute

### 🔹 1. Fork the Repository

1. Click the **Fork** button at the top of the repository.
2. Clone the forked repository to your local machine:

```sh
git clone https://github.com/your-username/halallife.git
cd halallife
```

### 🔹 2. Create a Feature Branch

```sh
git checkout -b feature/your-feature-name
```

Follow this naming convention:

- **feature/**`new-feature`
- **bugfix/**`issue-description`
- **hotfix/**`critical-fix`

### 🔹 3. Install Dependencies

#### Frontend:

```sh
cd frontend
npm install
```

#### Backend:

```sh
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 🔹 4. Follow Coding Standards

- Use **Prettier & ESLint** for frontend:
  ```sh
  npm run lint && npm run format
  ```
- Use **Black & Flake8** for backend:
  ```sh
  black . && flake8 .
  ```
- Follow **PascalCase** for functions and classes in Python.

### 🔹 5. Run Tests

#### Frontend Tests (Jest):

```sh
cd frontend
npm test
```

#### Backend Tests (Pytest):

```sh
cd backend
pytest
```

### 🔹 6. Commit Your Changes

```sh
git add .
git commit -m "✨ Added new feature: Feature description"
git push origin feature/your-feature-name
```

Follow **Conventional Commits**:

- `✨ feat:` New features
- `🐛 fix:` Bug fixes
- `📝 docs:` Documentation updates
- `🚀 perf:` Performance improvements
- `♻️ refactor:` Code restructuring

### 🔹 7. Open a Pull Request (PR)

1. Go to **GitHub → Your Fork → Compare & pull request**.
2. Add a **clear description** of what you changed.
3. Wait for **code review** and feedback.

---

## 📌 Reporting Issues

If you find a bug, please **create an issue** with:

- A **clear title** and description.
- Steps to **reproduce the bug**.
- Screenshots (if applicable).
- Expected vs. actual behavior.

---

## 📌 Code of Conduct

We follow a **respectful and inclusive community**. Be kind, professional, and open to feedback.

---

🚀 **Thank you for helping improve HalalLife!**
