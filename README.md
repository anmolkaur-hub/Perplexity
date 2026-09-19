AI-Powered Conversational Search Platform

A full-stack AI conversational search application inspired by modern AI answer engines. Users can create conversations, ask questions, receive LLM-generated responses, and access their previous chats.

Features

User registration and login

JWT-based authentication with HTTP-only cookies

Persistent chat history with MongoDB

Gemini-powered AI responses using LangChain

Automatic chat titles

Markdown and GitHub-Flavored Markdown rendering

Chat deletion and conversation management

Socket.IO connection for real-time communication

React + Redux frontend

Node.js + Express backend

Tech Stack

Frontend

React

Vite

Redux Toolkit

React Router

Axios

Tailwind CSS

React Markdown

Socket.IO Client

Backend

Node.js

Express

MongoDB

Mongoose

JWT

bcrypt

Socket.IO

LangChain

Google Gemini

Nodemailer

Project Structure

Perplexity/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── validators/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md

Setup

1. Clone the repository

git clone YOUR_REPOSITORY_URL
cd Perplexity

2. Backend

cd Backend
npm install

Create a .env file using .env.example and add your own credentials.

Start the backend:

npm run dev

The backend runs on:

http://localhost:3000

3. Frontend

Open another terminal:

cd Frontend
npm install
npm run dev

The frontend will be available at the Vite development URL shown in the terminal.

Environment Variables

Do not commit .env files or API keys to GitHub.

Backend environment variables include:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
MISTRAL_API_KEY=your_mistral_api_key
CLIENT_URL=http://localhost:5173

Use the provided .env.example files as templates.

Authentication Flow

User registers an account.

Password is securely hashed with bcrypt.

User logs in.

JWT authentication is stored in an HTTP-only cookie.

Protected chat routes verify the authenticated user.

Chat and message data are stored in MongoDB.

Chat Flow

User
  ↓
React Frontend
  ↓
Express API
  ↓
Authentication
  ↓
MongoDB Chat History
  ↓
LangChain + Gemini
  ↓
AI Response
  ↓
MongoDB
  ↓
React UI

Security

Secrets are stored in environment variables.

.env files should never be committed.

Passwords are hashed before storage.

Authentication uses HTTP-only cookies.

Protected API routes verify the logged-in user.

Future Improvements

Full web-search and source-citation pipeline

Streaming AI responses

Improved Socket.IO real-time message handling

Multiple LLM provider fallback

Production deployment

Conversation search and filtering

Author

Anmol Kaur
