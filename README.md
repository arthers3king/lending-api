# Lending API

A NestJS-based API for managing lending and repayment transactions between users. This project uses SQLite as the database and provides JWT-based authentication for secure access.

---

## Features

- **User Management**:
  - Register new users with wallet balance initialization.
  - Login and secure authentication using JWT.
- **Lending and Repayment**:
  - Create lending transactions between users.
  - Create repayment transactions.
  - Summarize a user's total balance of debts and credits.
  - Retrieve transaction history.
- **Secure Access**:
  - Authentication using JWT with `Bearer` tokens.

---

## Technologies

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: SQLite (TypeORM)
- **Authentication**: PassportJS with JWT
- **Environment Variables**: Managed via `@nestjs/config`

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/arthers3king/lending-api.git
   cd lending-api
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```plaintext
   JWT_SECRET_KEY=your-secret-key
   ```

4. Start the server:
   ```bash
   yarn start:dev
   ```

---

# Lending API Documentation

This API is designed to manage user accounts, lending transactions, and wallet top-ups. Below is a detailed guide on how to use the available endpoints.

---

## **Authentication Endpoint**

### **Login**

- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Headers**:
  ```plaintext
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "your-jwt-token"
  }
  ```
- **Error Responses**:
  - **401 Unauthorized**: If the email or password is invalid.
    ```json
    {
      "statusCode": 401,
      "message": "Invalid email or password",
      "error": "Unauthorized"
    }
    ```

---

## **Authentication Flow**

1. The user provides their email and password in the request body.
2. If the credentials are valid:
   - The server generates a JWT token.
   - The token is returned to the client.
3. If the credentials are invalid:
   - The server returns a `401 Unauthorized` error.

---

## **Using the JWT Token**

Once the client receives the JWT token, they must include it in the `Authorization` header for all protected endpoints.

## **API Endpoints**

### **1. User Management**

#### **Create User**

- **Endpoint**: `POST /users`
- **Description**: Register a new user with an initial wallet balance of 0.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "wallet": 0
  }
  ```
- **Error Responses**:
  - **409 Conflict**: If the email or name already exists.
    ```json
    {
      "statusCode": 409,
      "message": "Email or name already exists.",
      "error": "Conflict"
    }
    ```

---

### **2. User Profile**

#### **Get User Profile**

- **Endpoint**: `GET /users/profile/:userId`
- **Description**: Retrieve a user's profile, wallet balance, and debt summary. Requires authentication.
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Path Parameter**:
  - `userId`: The ID of the user.
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "wallet": 1000
    },
    "debts": {
      "debtToOthers": 500,
      "debtFromOthers": 300
    }
  }
  ```
- **Error Responses**:
  - **404 Not Found**: If the user does not exist.
    ```json
    {
      "statusCode": 404,
      "message": "User with ID 99 not found.",
      "error": "Not Found"
    }
    ```

---

### **3. Wallet Management**

#### **Top Up Wallet**

- **Endpoint**: `POST /users/wallet/top-up`
- **Description**: Add funds to a user's wallet. Requires authentication.
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "userId": 1,
    "amount": 500
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Top up to wallet with id 1 success"
  }
  ```
- **Error Responses**:
  - **400 Bad Request**: If the amount is less than or equal to 0.
    ```json
    {
      "statusCode": 400,
      "message": "Amount must be greater than zero",
      "error": "Bad Request"
    }
    ```
  - **404 Not Found**: If the user does not exist.
    ```json
    {
      "statusCode": 404,
      "message": "User with ID 99 not found.",
      "error": "Not Found"
    }
    ```

---

## **Authentication**

- **Authentication Type**: Bearer Token (JWT)
- **Header**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## **Error Handling**

### **Common Error Responses**

1. **400 Bad Request**:

   - Invalid input parameters or negative amounts.

   ```json
   {
     "statusCode": 400,
     "message": "Amount must be greater than zero",
     "error": "Bad Request"
   }
   ```

2. **404 Not Found**:

   - Requested resource (e.g., user) not found.

   ```json
   {
     "statusCode": 404,
     "message": "User with ID 99 not found.",
     "error": "Not Found"
   }
   ```

3. **409 Conflict**:
   - Duplicate email or name during user registration.
   ```json
   {
     "statusCode": 409,
     "message": "Email or name already exists.",
     "error": "Conflict"
   }
   ```

---

## **Transaction Endpoints**

### **1. Create Lending Transaction**

- **Endpoint**: `POST /transactions/lending`
- **Description**: Creates a lending transaction where one user lends money to another.
- **Request Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "lenderId": 1,
    "borrowerId": 2,
    "amount": 500
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "amount": 500,
    "type": "BORROW",
    "lender": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "wallet": 200
    },
    "borrower": {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "wallet": 200
    },
    "createdAt": "2024-12-03T10:00:00Z"
  }
  ```
- **Error Responses**:
  - **404 Not Found**: If the lender or borrower does not exist.
  - **403 Forbidden**: If the lender's wallet does not have enough funds.

---

### **2. Create Repayment Transaction**

- **Endpoint**: `POST /transactions/repay`
- **Description**: Creates a repayment transaction where one user repays money to another.
- **Request Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "lenderId": 1,
    "borrowerId": 2,
    "amount": 300
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "amount": 300,
    "type": "REPAY",
    "lender": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "wallet": 200
    },
    "borrower": {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "wallet": 200
    },
    "createdAt": "2024-12-03T11:00:00Z"
  }
  ```
- **Error Responses**:
  - **404 Not Found**: If the lender or borrower does not exist.
  - **403 Forbidden**: If the borrower's wallet does not have enough funds.

---

### **3. Get Transaction Summary**

- **Endpoint**: `POST /transactions/summary`
- **Description**: Retrieves the summary of a user's debts and credits.
- **Request Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "userId": 1
  }
  ```
- **Response**:
  ```json
  {
    "userId": 1,
    "balance": 200
  }
  ```
- **Error Responses**:
  - **404 Not Found**: If the user does not exist.

---

### **4. Get Transaction History**

- **Endpoint**: `GET /transactions`
- **Description**: Retrieves a user's transaction history.
- **Request Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Query Parameters**:
  - `userId` (required): The ID of the user.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "lender": "John Doe",
      "borrower": "Jane Doe",
      "amount": 500,
      "type": "BORROW",
      "date": "2024-12-03T10:00:00Z"
    },
    {
      "id": 2,
      "lender": "John Doe",
      "borrower": "Jane Doe",
      "amount": 300,
      "type": "REPAY",
      "date": "2024-12-03T11:00:00Z"
    }
  ]
  ```
- **Error Responses**:
  - **404 Not Found**: If the user does not exist.

---

## **Transaction Types**

1. **BORROW**: A transaction where a lender gives money to a borrower.
2. **REPAY**: A transaction where a borrower repays money to a lender.

---

## **Contact**

For questions or suggestions, contact us at:

- Email: akrapongkarinrak@gmail.com
- GitHub: [arthers3king](https://github.com/arthers3king)
