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
   git clone https://github.com/your-repo/lending-api.git
   cd lending-api
   ```
