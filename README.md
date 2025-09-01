# Store Rating System

A full-stack application where **Users** can rate stores, **Owners** can view ratings for their stores, and **Admins** can manage users and stores.  
Built using **React (frontend)**, **Node.js + Express (backend)**, and **MySQL with Sequelize (database ORM).**

##  Features
- **Authentication** (JWT-based) for User, Owner, Admin.
- **Role-based dashboards**:
  - **User**: signup, login, view stores, give ratings.
  - **Owner**: login, add their store, view customer ratings & average rating.
  - **Admin**: login, view all users, stores, ratings; delete users/stores.
- Secure **password hashing** with bcrypt.
- Clean **UI with role-based navigation**.


## Tech Stack

- **Frontend**: React, Axios, React Router  
- **Backend**: Node.js, Express  
- **Database**: PostgreSQL, Sequelize ORM  
- **Authentication**: JWT (JSON Web Token)  

---

## ⚙️ Setup Instructions

### 1️.Clone the repository
```bash
git clone https://github.com/varuun0301/store-rating-system.git
cd store-rating-system
````

### 2️.Backend Setup

```bash
cd backend
npm install
```

* Configure database in `backend/config/config.json`:
```json
{
  "development": {
    "username": "root",
    "password": "yourpassword",
    "database": "rating_system",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

* Run migrations:
```bash
npx sequelize db:create
npx sequelize db:migrate
```

* Start backend server:
```bash
npm run dev
```

Backend runs at **[http://localhost:5000](http://localhost:5000)**

### 3️.Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at **[http://localhost:3000](http://localhost:3000)**

---

## (IMPORTANT) 
## Creating an Admin User

Since **Admin signup is disabled in UI**, evaluators must manually create an Admin.
There are two ways:

### Option 1: Insert directly into DB

```sql
INSERT INTO Users (name, email, password, role, address, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2b$10$9JHjWgBC6J6Nv7jz5QpZ9uZpPmpcR0rrpI2R8sL3T5ojSYGfIsdAu', 
  'ADMIN',
  'Admin Address',
  NOW(),
  NOW()
);
```

> Password is `admin123` (bcrypt hashed). Use this to login.

---

### Option 2: Use Postman

1. Send a **POST request** to `http://localhost:5000/auth/signup`
2. Body (JSON):

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN",
  "address": "Admin Address"
}
```

Now login with email: **[admin@example.com]**, password: **admin123**.

---

## 📂 Project Structure

```
store-rating-system/
│── backend/                # Node.js + Express + Sequelize
│   ├── config/             # DB config
│   ├── migrations/         # Sequelize migrations
│   ├── models/             # Sequelize models
│   ├── routes/             # Express routes (auth, admin, owner, user)
│   └── index.js            # Backend entry point
│
│── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # Pages (Login, Signup, Dashboards)
│   │   ├── components/     # Navbar
│   │   ├── styles/         # CSS files
│   │   └── api.js          # Axios setup
│   └── public/
│
└── README.md
```
