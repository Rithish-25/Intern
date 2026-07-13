# Employee Management System (EMS)

A production-grade, full-stack Employee Management System built with a React JS frontend, Node/Express JS backend, MongoDB Atlas database, and Firebase Authentication. The application implements a modern, premium professional dashboard featuring Glassmorphism, transition animations, real-time charts, and security protections.

---

## Tech Stack

### Frontend
- **Framework**: React JS (Initialized via Create React App)
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS (custom professional theme)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod with `@hookform/resolvers`
- **HTTP Client**: Axios (configured with token interceptors)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Animations**: Framer Motion
- **Tables**: `@tanstack/react-table`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Mongoose ODM**: Mongoose schemas and indexes
- **Security Middlewares**: Helmet, CORS, Compression, Morgan, Express Rate Limit
- **Authentication**: Firebase Admin SDK (token verification)
- **Validation**: Zod schemas
- **Logging**: Winston logger

---

## Key Features

1. **Firebase Authentication**: Persistent admin signup, login, password reset, and session storage.
2. **Access Control**: Fully protected client-side routes and secure server-side APIs (Firebase Token Validation).
3. **Admin Dashboard**: Real-time aggregated statistics (Total, Active, Inactive staff), interactive charts (employees by department, status distribution ratio), and lists of recent hires.
4. **Employee Directory (CRUD)**:
   - Data Table: Server-side pagination, sorting, search, and department/status filtering.
   - Profile Details: Displays information including contact details, active status, joining date, and history.
   - Creation & Edit Forms: Form validations using Zod schema resolvers.
   - Actions: Double-confirmation modal overlays for delete triggers.
5. **Modern Professional UI**: Glassmorphism cards, responsive hamburger sidebars, theme triggers (Dark/Light mode) persisting in local storage.

---

## Folder Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB, Winston, and Firebase initialization
│   │   ├── controllers/     # Route business logic (Employee, Dashboard stats)
│   │   ├── middlewares/     # Authentication, Error handling, Rate limiting
│   │   ├── models/          # Mongoose schema definitions
│   │   ├── routes/          # Express API route endpoints
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.js           # Express pipeline setup
│   │   └── server.js        # Server bootstrap entry point
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, Layout, Loader, Modals, States
│   │   ├── contexts/        # Session AuthContext observer
│   │   ├── firebase/        # Firebase Web Client configuration
│   │   ├── pages/           # Dashboard, EmployeeList, Details, Forms, Profile, 404
│   │   ├── services/        # Axios API client instances
│   │   ├── store/           # Redux store and slice configurations
│   │   ├── App.js           # Core routing trees
│   │   ├── index.js         # DOM injection point
│   │   └── index.css        # Tailwind directives and custom scroll/glass styles
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## Setup & Installation

### Prerequisite Checklist
- [Node.js](https://nodejs.org) (v16.x or newer recommended)
- MongoDB Atlas Account
- Firebase Console Access

### Step 1: Clone and Configure Environment Files

1. Navigate to the project root:
   ```bash
   cd "c:/Rithish Projects/Intern"
   ```
2. Copy environmental variable templates:
   - Backend:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Frontend:
     ```bash
     cp frontend/.env.example frontend/.env
     ```

---

## Firebase Setup Guide

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Click **Add Project** and follow the prompts.
2. **Enable Email/Password Authentication**:
   - In the Firebase sidebar, navigate to **Build > Authentication**.
   - Go to the **Sign-in method** tab, click **Email/Password**, enable it, and save.
3. **Get Frontend Web Credentials**:
   - Click the gear icon next to **Project Overview** > **Project Settings**.
   - Under **Your apps**, register a web app (`EMS Web Portal`).
   - Copy the configuration object keys (`apiKey`, `authDomain`, `projectId`, etc.).
   - Place these in your `frontend/.env` file.
4. **Get Backend Service Account Keys**:
   - In the Firebase Console, go to **Project Settings > Service Accounts**.
   - Select **Node.js** and click **Generate new private key**.
   - Open the downloaded JSON file.
   - Map `project_id`, `client_email`, and `private_key` to the corresponding variables in your `backend/.env` file.
   > [!NOTE]
   > Ensure the `private_key` string starts with `"-----BEGIN PRIVATE KEY-----\n..."` and includes `\n` characters correctly.

---

## MongoDB Atlas Setup Guide

1. **Create Cluster**:
   - Go to [MongoDB Atlas Console](https://www.mongodb.com/cloud/atlas).
   - Create a free cluster (`Cluster0`).
2. **Create Database User**:
   - Go to **Security > Database Access**.
   - Add a database user with username `rithish` and password `rithish`. Assign the role **Read and write to any database**.
3. **Configure IP Access Whitelist**:
   - Go to **Security > Network Access**.
   - Add IP address `0.0.0.0/0` (allows connection from all IPs for development).
4. **Copy connection string**:
   - Click **Database > Connect > Drivers**.
   - Copy the connection string and place it in your `backend/.env` file under `MONGODB_URI`.
   - *(Note: Your connection string is already configured by default in `backend/.env`).*

---

## API Documentation

All API routes are prefixed with `/api/v1` and require a valid Bearer Token in the `Authorization` header.

### Authentication
Include the Firebase client ID Token in headers:
```text
Authorization: Bearer <firebase_id_token>
```

### Endpoints

| Method | Endpoint | Description | Query Params / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/dashboard/stats` | Fetches card tallies, department lists, status pie arrays, and top 5 recent hires. | *None* |
| **GET** | `/employees` | Retrieve Paginated, Filtered, Sorted and Searched Employee lists. | `page`, `limit`, `search`, `department`, `status`, `sortBy`, `sortOrder` |
| **GET** | `/employees/:id` | View profile metadata for a single employee record. | *Path Parameter: id* |
| **POST** | `/employees` | Register a new employee inside the database. | Body (JSON): `fullName`, `email`, `mobile`, `department`, `designation`, `joiningDate`, `status` |
| **PUT** | `/employees/:id` | Update properties on a single employee record. | Body (JSON): `fullName`, `email`, `mobile`, `department`, `designation`, `joiningDate`, `status` |
| **DELETE**| `/employees/:id` | Remove an employee record permanently. | *Path Parameter: id* |

---

## Running the Application Locally

We run both the frontend and backend in parallel on separate command terminals.

### 1. Launch Backend Server
```bash
cd backend
npm run dev
```
The server will connect to MongoDB Atlas and start listening on port **5000** (`http://localhost:5000`).

### 2. Launch Frontend React Application
```bash
cd frontend
npm start
```
The React dev server will compile and start on port **3000** (`http://localhost:3000`). Access the admin dashboard in your web browser.

---

## Assumptions & Architectural Decisions
- **Plain JavaScript Focus**: Bypasses typescript/tsx build steps to ensure compilation speed and reduce dependency footprints.
- **Server-Side Operations**: Search, sorting, pagination, and filters are executed at the database query level (via Mongoose aggregates and pipeline limits) rather than fetching all rows and sorting client-side, ensuring scalability.
- **Firebase Persistence**: Uses Firebase Authentication persistence config (`local` vs `session`) depending on whether the user selects "Remember Me".
- **Unique Constraints**: Email indices are created on the MongoDB collection to prevent duplicate records.

---

## Future Enhancements
- **Multi-Role RBAC**: Add supervisor and editor roles inside Firebase custom user claims.
- **CSV Data Exporter**: Integrate standard spreadsheet exports for audit logs.
- **Employee Auditing Logs**: Store modification histories tracking which admin performed changes.
