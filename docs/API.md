# HalalLife API Documentation

## 📌 Introduction

The **HalalLife API** is a **FastAPI** backend that powers the **HalalLife mobile application**. It provides a set of RESTful endpoints to:

- Verify **halal** product status via **barcode scanning**.
- Suggest **halal alternatives** for haram products.
- Enable **community contributions** for halal verification.
- Locate **halal-certified restaurants**.

## 🚀 Base URL

```
https://api.halallife.com/v1
```

---

## 🛠️ Endpoints

#### 🔹 Register

`POST /auth/signup`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

---

### 2️⃣ **Product Scanning**

#### 🔹 Get Product Details by Barcode

`GET /products/{barcode}`

**Example:**

```
GET /products/8901764023766
```

**Response:**

```json
{
  "product_name": "Halal Chicken Sausage",
  "halal_status": "Halal",
  "ingredients": ["Chicken", "Salt", "Spices"],
  "alternatives": [{ "name": "Beef Sausage", "barcode": "987654321" }]
}
```

#### 🔹 Suggest Halal Alternative

`GET /products/{barcode}/alternatives`

**Example:**

```
GET /products/8901764023766/alternatives
```

**Response:**

```json
{
  "alternatives": [{ "name": "Halal Turkey Sausage", "barcode": "123456789" }]
}
```

---

### 3️⃣ **Restaurant Locator**

#### 🔹 Find Nearby Halal Restaurants

`GET /restaurants?lat={latitude}&lng={longitude}`

**Example:**

```
GET /restaurants?lat=40.7128&lng=-74.0060
```

**Response:**

```json
{
  "restaurants": [
    {
      "name": "Halal Brothers NYC",
      "address": "5th Ave, New York, NY",
      "rating": 4.8
    }
  ]
}
```

---

#### 🔹 Report Incorrect Product Data

`POST /products/{barcode}/report`

**Request:**

```json
{
  "issue": "Ingredients are incorrect",
  "corrected_data": {
    "ingredients": ["Beef", "Salt", "Pepper"]
  }
}
```

**Response:**

```json
{
  "message": "Report submitted successfully"
}
```

---

## 📌 FastAPI Auto-Generated Documentation

FastAPI provides **interactive API documentation**:

- **Swagger UI:** [https://api.halallife.com/docs](https://api.halallife.com/docs)
- **ReDoc UI:** [https://api.halallife.com/redoc](https://api.halallife.com/redoc)

---

## 📌 Response Codes

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 404  | Not Found    |
| 500  | Server Error |

---

## 📌 Contact & Support

For any API-related issues, contact the **HalalLife Development Team** at `support@halallife.com`.

---

🚀 **Enjoy building with HalalLife API!**
