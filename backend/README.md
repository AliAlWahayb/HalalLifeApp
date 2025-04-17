# HalalLife Backend API

This is the backend API for the HalalLife application, built with FastAPI, Firebase (main database), and SQLite (local storage).

## Project Structure

```
backend/
├── app/                  # Main application code
│   ├── api/              # API endpoints
│   │   └── api_v1/       # API version 1
│   │       └── endpoints/# API endpoint modules
│   ├── core/             # Core application components
│   ├── crud/             # CRUD operations
│   ├── db/               # Database configuration
│   │   ├── firebase.py   # Firebase connection and utilities
│   │   └── sqlite.py     # SQLite local storage utilities
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic data validation schemas
│   └── utils/            # Utility functions
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── main.py               # Application entry point
└── requirements.txt      # Python dependencies
```

## Database Structure

The application uses a dual-database approach:

1. **Firebase** (primary database):
   - User authentication and profile data
   - Application data
   - Synchronization across devices

2. **SQLite** (local storage):
   - Ingredients data with halal status
   - Products data with ingredients lists
   - History tracking for ingredients and products

### SQLite Tables Structure

The SQLite database has four tables:

1. **ingredients** - Stores ingredients information:
   - id, name, barcode, category, halal_status, description, certification, etc.

2. **products** - Stores product information:
   - id, name, barcode, brand, ingredients_list, halal_status, etc.

3. **ingredients_history** - Tracks changes to ingredients:
   - ingredient_id, change_type, field_name, old_value, new_value, changed_by, etc.

4. **products_history** - Tracks changes to products:
   - product_id, change_type, field_name, old_value, new_value, changed_by, etc.

## Setup

### Prerequisites

- Python 3.9+
- Firebase project with Firestore database
- Firebase Admin SDK credentials

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Copy the `.env.example` file to `.env` and update the values:
   ```
   cp .env.example .env
   ```
6. Add your Firebase credentials:
   - Either as a JSON string in the `FIREBASE_CREDENTIALS` environment variable
   - Or as a path to the credentials file in `FIREBASE_CREDENTIALS_PATH`

## Running the Application

### Development mode

```
uvicorn main:app --reload
```

### Production mode

```
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the application is running, you can access the documentation at:

- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## Authentication

The API supports multiple authentication methods:

1. **Firebase Authentication** (client-side):
   - Frontend authenticates directly with Firebase
   - Provides the Firebase ID token to the backend

2. **Server-side JWT** (for API access):
   - Register a new user: `POST /api/auth/register`
   - Login to get an access token: `POST /api/auth/login`
   - Use the token in the Authorization header: `Authorization: Bearer {token}`

## User Data

All user data is stored in Firebase Firestore with these endpoints:

- Get all users (admin only): `GET /api/users/`
- Create a user (admin only): `POST /api/users/`
- Get current user: `GET /api/users/me`
- Update current user: `PUT /api/users/me`
- Get user by ID: `GET /api/users/{user_id}`

## Ingredients API

Manage ingredients in the local SQLite database:

- Get all ingredients: `GET /api/ingredients/`
- Search ingredients: `GET /api/ingredients/?search=text`
- Get ingredient by ID: `GET /api/ingredients/{ingredient_id}`
- Create ingredient: `POST /api/ingredients/`
- Update ingredient: `PUT /api/ingredients/{ingredient_id}`

## Products API

Manage products in the local SQLite database:

- Get all products: `GET /api/products/`
- Search products: `GET /api/products/?search=text`
- Get product by ID: `GET /api/products/{product_id}`
- Create product: `POST /api/products/`
- Update product: `PUT /api/products/{product_id}`

## Development

### Adding a New Endpoint

1. Create a new file in `app/api/api_v1/endpoints/` if needed
2. Define your APIRouter and endpoints
3. Import and include your router in `app/api/api_v1/api.py`

### Adding a New Firebase Collection

1. Create a new CRUD class in the `app/crud/` directory
2. Use the FirestoreDB class from `app/db/firebase.py` as a base
3. Create corresponding Pydantic schemas in `app/schemas/`
4. Create API endpoints to interact with your new collection

### Working with SQLite

1. For local storage features, use the SQLiteDB class from `app/db/sqlite.py`
2. Create helper functions in `app/api/deps.py` if needed
3. Use these functions in your API endpoints

## Testing

Run tests with pytest:

```
pytest
```

## Integration with React Native Frontend

The backend includes CORS configuration to allow requests from the React Native frontend. 
The allowed origins can be configured in the `.env` file. 