# Hospital Management System

A dynamic, web-based hospital management solution built with Node.js, Express, Sequelize, and SQLite.

## Tech Stack

- **Backend**: Node.js, Express framework, Sequelize ORM (SQLite adapter)
- **Database**: SQLite3 (single-file local database storage)
- **Frontend**: Vanilla HTML5, CSS3 (glassmorphism/premium design themes), and clean Vanilla JS API integration
- **Automation Logic**: Encapsulated in a reusable local agent skill (`.agent/skill/support-chatbot`)

## Project Structure

- `server.js`: Entry point for the backend.
- `public/`: Contains static HTML, CSS, and Client-side JS.
  - `css/chatbot.css`: Custom premium styles for chatbot launcher and chat layout.
  - `js/chatbot.js`: Floating chat bubble injection and auto-responder fetching.
- `src/`: Backend logic, models, and routes.
  - `config/`: Database configuration (Sequelize).
  - `models/`: Database models including the new `SupportInquiry`.
  - `routes/`: Express API routes including `/api/support`.
  - `controllers/`: Handles API requests and matches queries.
- `.agent/skill/support-chatbot/`: Reusable automation skill module containing:
  - `SKILL.md`: Documentation of support-chatbot skill capabilities.
  - `responder.js`: Local NLP/keyword-matching chatbot engine.
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

3.  **Seed Dummy Data**:
    If you want to populate the database with test data:
    ```bash
    node seed.js
    ```

4.  **Access the application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Patient Management**: Registration, profile updates, and appointment booking.
- **Doctor Management**: Schedule management and patient record updates.
- **Admin Portal**: User management, appointment audits, and a Support Ticket Inbox.
- **SQLite Database**: Lightweight and portable local data storage.

---

## AI & Automation Feature

This prototype implements a **Dynamic AI Support Chatbot & Support Ticket Form** to automate standard clinic communications:
- **Floating FAQ Chatbot**: Accessible directly in the bottom-right corner of the homepage.
- **Dynamic Database Search**: When a user asks about doctors or specializations (e.g., *"Who is the cardiologist?"*), the chatbot dynamically queries the active Sequelize database models and formats availability times automatically.
- **Fallback Support Ticketing**: For general inquiries that cannot be resolved with high confidence by the bot, a ticket is created with state `pending` so human administrators can review and reply to it from the Admin Inbox.

---

## NGO Use-Case

NGOs operating community clinics or mobile camps often face severe **resource constraints** with limited clerical staff. 
1. **Administrative Relief**: By automatically answering repeated questions about clinic hours, location, booking steps, and available doctors, the system frees up field volunteers to focus on direct patient care.
2. **Dynamic Scheduling Lookup**: In remote settings, doctor schedules shift frequently. By pulling schedule data directly from the live database rather than hardcoded text, the bot guarantees up-to-date responses.
3. **Structured Ticket Auditing**: Low-confidence questions are stored in a database index. This lets NGO coordinators view patient feedback, analyze common inquiries, and follow up directly with the community to optimize operations.

---
