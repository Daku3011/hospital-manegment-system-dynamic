# Hospital Management System

A dynamic, web-based hospital management solution built with Node.js, Express, Sequelize, and SQLite.

## Project Structure

- `server.js`: Entry point for the backend.
- `public/`: Contains static HTML, CSS, and Client-side JS.
- `src/`: Backend logic, models, and routes.
  - `config/`: Database configuration (Sequelize).
  - `models/`: Database models.
  - `routes/`: Express API routes.
- `database.sqlite`: Local SQLite database storage.

## How to Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the server**:
    ```bash
    npm start
    ```
    OR, for development with auto-reload:
    ```bash
    npm run dev
    ```

4.  **Seed Dummy Data**:
    If you want to populate the database with test data:
    ```bash
    node seed.js
    ```

3.  **Access the application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Patient Management**: Registration, profile updates, and appointment booking.
- **Doctor Management**: Schedule management and patient record updates.
- **Admin Portal**: User management and system overview.
- **SQLite Database**: Lightweight and portable local data storage.

---
Built by Antigravity.
