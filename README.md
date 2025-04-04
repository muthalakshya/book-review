﻿# Book Review Platform

## Objective
Develop a book review platform where users can browse books, read and write reviews, and rate books. The application consists of three main components:
- **Frontend**: React-based user interface
- **Backend**: Node.js with Express and database (SQL/MongoDB)
- **Admin Panel**: A separate React-based admin interface

## Project Structure
```
book-review-platform/
│-- admin/        # Admin panel (React)
│-- frontend/     # User-facing frontend (React)
│-- backend/      # Backend (Node.js, Express, SQL/MongoDB)
```

## Features
### Frontend (React)
- Responsive UI with:
  - Home page featuring books
  - Book listing page with search & filter functionality
  - Individual book page with details and reviews
  - User profile page
  - Review submission form
- State management using Redux/React Context
- React Router for navigation
- API integration with the backend
- Error handling and loading states

### Backend (Node.js, Express, SQL/MongoDB)
- RESTful API with the following endpoints:
- Data validation and error handling
- Database for data persistence (SQL/MongoDB)

## Installation & Setup
### Step 1: Clone the Repository
```sh
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
```

### Step 2: Install Dependencies
Run the following command in each directory (`admin`, `frontend`, and `backend`):
```sh
cd admin && npm i
cd frontend && npm i
cd backend && npm i
```

### Step 3: Start the Application
#### Start Frontend & Admin Panel
```sh
cd frontend && npm run dev  # Starts the frontend
cd admin && npm run dev      # Starts the admin panel
```
#### Start Backend
```sh
cd backend && nodemon server.js
```
Happy coding! 🚀

