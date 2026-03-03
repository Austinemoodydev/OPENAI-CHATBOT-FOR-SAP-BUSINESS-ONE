
# 🌈 Crown Paints SAP AI Chatbot

[![Node.js](https://img.shields.io/badge/Node.js-v20-green)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-blue)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/Austinemoodydev/OPENAI-CHATBOT-FOR-SAP-BUSINESS-ONE)](https://github.com/Austinemoodydev/OPENAI-CHATBOT-FOR-SAP-BUSINESS-ONE/issues)



 About

This project is a **smart AI assistant for SAP Business One**, designed to help teams quickly access customer data, stock info, invoices, and more, all from a simple chat interface. Think of it like ChatGPT but tailored for your ERP system — saving time, reducing errors, and making SAP a little less intimidating.

I built it because querying SAP manually can be slow, and I wanted something fast, interactive, and secure that anyone on the team could use without coding knowledge.

-

 Features

* Chat with your SAP data in real-time.
* Retrieve **customers, invoices, stock levels, and other info** effortlessly.
* AI-powered answers** using OpenAI’s GPT API.
* Clean frontend interface** with HTML, CSS, and Bootstrap.
* **Secure backend** with Node.js and Express.
* Secrets handled via `.env` so your API keys stay safe.

---

## How It Works

1. The frontend sends a user query to the backend.
2. The backend reads your SAP database and prepares a prompt.
3. OpenAI API processes the prompt and returns a response.
4. The frontend displays it nicely in the chat interface.

---

## Project Structure


sap-ai-chatbot/
├── backend/
│   ├── server.js          # Node.js API server
│   ├── .env               # Store your API keys here (ignored by Git)
│   └── package.json
├── frontend/
│   ├── index.html         # Chat interface
│   ├── style.css          # Styling
│   └── app.js             # Frontend logic
├── .gitignore             # Keeps secrets out of Git
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Austinemoodydev/OPENAI-CHATBOT-FOR-SAP-BUSINESS-ONE.git
cd OPENAI-CHATBOT-FOR-SAP-BUSINESS-ONE
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside `backend/`:

```
OPENAI_API_KEY=your_openai_api_key_here
```

> ⚠️ Make sure this file is **not committed** to Git.

### 4. Start the backend server

```bash
node server.js
```

### 5. Open the frontend

Open `frontend/index.html` in your browser and start chatting.

---

## Tips & Notes

* Keep your **API keys secret** — do not share `.env`.
* This is a lightweight version — feel free to extend it for **more SAP modules** or integrate **user authentication**.
* It works best with **modern browsers** like Chrome or Edge.

---

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add something cool"`.
4. Push to your branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

MIT License — free to use, modify, or share.

---

## Contact

**Austine Mady**
[GitHub](https://github.com/Austinemoodydev) | [Email](mailto:your-email@example.com)

---

If you want, I can **also make an even more “friendly dev-style version”** with small jokes, emojis, and casual tips that feel like a real developer wrote it for teammates, not like an AI documentation.

Do you want me to do that next?
