---
name: support-chatbot
description: "Automated FAQ and support inquiry responder that queries doctors, schedules, and general hospital rules."
risk: safe
date_added: "2026-07-14"
---

# Support Chatbot Skill

A reusable automation module that processes customer support inquiries and chatbot requests. It parses keywords, classifies the inquiry category, dynamically queries the database for active resources (such as doctors and specializations), and generates accurate automated responses.

## Inputs
- `message` (String): The plain text message or inquiry submitted by the user.
- `models` (Object): The database models object containing `sequelize`, `User`, `Doctor`, etc.

## Outputs
Returns an object containing:
- `response` (String): The AI-generated or rule-based response.
- `category` (String): Classified category (`General`, `Appointment`, `Doctor`, `Billing`, `Feedback`).
- `confidence` (Number): Confidence score between `0.0` and `1.0` indicating whether the query was fully resolved by AI.

## Dependencies
- `sequelize` and `sqlite3` for querying the database.
- SQLite database configured with `Doctor` and `User` tables.

## Usage in Express Controller
```javascript
const chatbotSkill = require('../../.agent/skill/support-chatbot/responder');
const models = require('../models');

const result = await chatbotSkill.generateAutoResponse(req.body.message, models);
```
