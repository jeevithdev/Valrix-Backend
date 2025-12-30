📦 College Barter System – Backend

A backend API built with Node.js, Express, and MongoDB that allows college students to barter items securely within their campus.

Only verified student emails are allowed to register.

🚀 Features
🔐 Authentication

Student registration & login

JWT-based authentication

Password hashing using bcrypt

Protected routes with middleware

🎓 Student-Only Access

Registration is allowed only for:

Emails ending with .edu, .ac.in, .edu.in

Emails containing roll numbers / digits

This blocks non-student emails like Gmail or Outlook.

🔄 Barter System

Create trade requests

Accept or reject trades

Items are locked when a trade is accepted

Trade is completed only after ownership is swapped

Prevents double trading of items

Trade flow:

pending → accepted → completed / rejected

🧱 Tech Stack

Node.js

Express.js

MongoDB (Atlas)

Mongoose

JWT

bcrypt

dotenv

📁 Project Structure
College-BarterSystem-Backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
│
├── .env
├── package.json
└── README.md

⚙️ Setup
1️⃣ Clone
git clone https://github.com/jeevithdev/College-BarterSystem-Backend.git
cd College-BarterSystem-Backend

2️⃣ Install
npm install

3️⃣ Environment Variables

Create a .env file:

PORT=5000
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/barterDB

4️⃣ Run Server
npm start


Server runs at:

http://localhost:5000

🔗 API Routes
Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

Trades

POST /api/trades/request

GET /api/trades/my-requests

GET /api/trades/requests-for-me

POST /api/trades/:id/accept

POST /api/trades/:id/reject

POST /api/trades/:id/complete

📝 Notes

Ownership changes only when a trade is completed

Accepted trades lock items to prevent conflicts

Designed with real backend practices in mind
