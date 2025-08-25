#  ProConnect – Connecting Skilled Contractors with Customers

##  Project Overview
ProConnect is a full-stack web application designed to bridge the gap between skilled contractors and customers in need of their services. Many skilled workers such as plumbers, electricians, and tilers struggle to find consistent employment, while customers often face difficulty finding reliable and affordable service providers. ProConnect solves this by providing a secure, user-friendly platform where skills meet demand efficiently.

The platform supports three types of users:
- **Customers** – can search for contractors, request services, and manage bookings.
- **Contractors** – can create professional profiles, list their skills, set service rates, and accept jobs.
- **Admins** – oversee platform activity, manage users, and ensure smooth operation.

---

##  Features
- User registration and login system for Customers, Contractors, and Admins.
- Contractor profiles with skills, service details, and rates.
- Customer job request system for hiring contractors easily.
- Admin dashboard for managing users and monitoring platform activity.
- Clean, responsive layout and professional styling for an intuitive user experience.
- Dedicated pages for each function to maintain clarity and organization.

---

##  Technology Stack

ProConnect is built using modern web development technologies to create a responsive, secure, and user-friendly platform. The main technologies include:

- **Frontend:**  
  - Vue.js – for building a dynamic and reactive user interface.  
  - Bootstrap – for responsive design and consistent styling.  

- **Backend:**  
  - Node.js – to run JavaScript on the server side.  
  - Express.js – to handle API routes, requests, and server logic.  

- **Database:**  
  - MySQL – to store user information, contractor profiles, job requests, and other platform data.  

- **Version Control & Collaboration:**  
  - Git & GitHub – to manage code, track changes, and collaborate as a team.  

- **Other Tools:**  
  - Postman – for testing backend APIs.  
  - dotenv – to manage environment variables securely.



## �� Challenges & Solutions

During the development of ProConnect, our team faced several challenges and implemented effective solutions to overcome them:

- **Frontend-backend integration:**  
  - *Challenge:* Connecting the Vue.js frontend with the Node.js/Express backend was initially complex.  
  - *Solution:* Implemented RESTful APIs and tested endpoints using Postman to ensure smooth communication between frontend and backend.

- **User authentication and security:**  
  - *Challenge:* Ensuring secure login and registration for all user types.  
  - *Solution:* Used hashed passwords stored in MySQL and implemented secure authentication flows for Customers, Contractors, and Admins.

- **Layout and styling consistency:**  
  - *Challenge:* Maintaining a clean and responsive design across all pages.  
  - *Solution:* Used Bootstrap for responsive layouts and added custom CSS for consistent styling and professional appearance.

- **Team collaboration:**  
  - *Challenge:* Coordinating work among team members and managing code changes.  
  - *Solution:* Used GitHub for version control, organized branches for different features, and regularly merged updates to maintain a smooth workflow.

  ` 
##  Team Members

- **Okuhle Sotyana** – Project Manager & Frontend Developer  
- **Mbali khumalo** – Frontend Developer  
- **Bheka Nyoni** – Backend Developer  
- **Tercia Abrahams** – Database Management

## ⚙️ How to Run the Website

Follow these steps to run the ProConnect website locally on your computer:

### 1. Clone the Repository
### dependencies to install in backend terminal
npm i node_modules
npm i express dotenv mysql2 cors bcrypt jsonwebtoken
 
```bash


cd backend
npm install        # Install backend dependencies
npm start          # Start the backend server


### dependencies to install in backend terminal
npm i node_modules
npm i express dotenv mysql2 cors bcrypt jsonwebtoken
 run  backend  in terminal = node --watch server.js


cd frontend
npm install        # Install frontend dependencies
npm run serve      # Start the frontend development server

## Dependencies

The frontend of this project was built using the following dependencies:

- **vue** (^3.x) – Core framework for building the user interface  
- **vue-router** (^4.x) – For handling navigation and routing between pages  
- **pinia** (^2.x) – State management for storing and managing app data  
- **bootstrap** (^5.x) – CSS framework for responsive design and styling  
- **bootstrap-icons** (^1.x) – Icon set used alongside Bootstrap  
- **axios** (^1.x) – For making HTTP requests to the backend API  
- **jspdf** (^2.x) – For generating PDF documents  
- **jspdf-autotable** (^3.x) – For creating PDF tables (e.g., invoices, reports)

### Development Dependencies
- **vite** (^5.x) – Development server and build tool  
- **@vitejs/plugin-vue** (^5.x) – Enables Vue support in Vite  
- **sass** (^1.x) – For customizing styles  
- **eslint** (^8.x) – Linting tool for code quality  
- **prettier** (^3.x) – Code formatter for consistent styling 

###DISCLAIMER
- if you want to login with admin...go to thunder client and put this on the body
{
  "email": "admin1@proconnect.co.za",
  "password": "SecurePass123",
  "address": "123 Admin Street, Cityville"
}