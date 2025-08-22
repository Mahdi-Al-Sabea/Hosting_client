# Frontend Hosting

This directory is for the React web application that connects to the Node.js Express backend in the `Hosting` directory.

## Features
- User authentication (login, register, logout)
- JWT access token and HTTP-only refresh token support
- Todo list management (add, view, update, delete)
- Communicates with backend via REST API

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. The app will connect to the backend API at `/Hosting` (update API URL in code if needed).

## Folder Structure
- `src/` - React source code
- `public/` - Static files

## Backend
See the `Hosting` directory for backend setup and API endpoints.
