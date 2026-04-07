// 1️⃣ Load dotenv properly (important for Windows paths)
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// 2️⃣ Check API key
console.log("API KEY:", process.env.OPENAI_API_KEY ? "LOADED" : "MISSING");

// 3️⃣ Import packages
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const db = require("./database");

// 4️⃣ Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// 5️⃣ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 SMART INTENT DETECTION
async function detectIntent(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Classify this SAP Business One request into ONE word only:
inventory
customer
invoice
sales
sap_help
general
`
      },
      { role: "user", content: message }
    ]
  });
  return response.choices[0].message.content.trim().toLowerCase();
}

// 🔹 AI DECIDES IF DATABASE IS NEEDED
async function needsDatabase(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Answer YES if this user message requires live company data (inventory, customer, invoice, sales). Otherwise, answer NO."
      },
      { role: "user", content: message }
    ]
  });
  return response.choices[0].message.content.toLowerCase().includes("yes");
}

// 6️⃣ Health route
app.get("/", (req, res) => {
  res.send("SAP AI Assistant for Crown Paints is running");
});

// 7️⃣ MAIN CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const intent = await detectIntent(userMessage);
    console.log("Detected intent:", intent);

    // Check if DB is needed for this request
    const dbNeeded = await needsDatabase(userMessage);

    // 🟢 INVENTORY
    if (intent === "inventory" && dbNeeded) {
      db.query("SELECT product_name, stock FROM inventory", async (err, results) => {
        if (err) return res.json({ reply: "Database error retrieving inventory." });

        const context = results.map(item => `${item.product_name}: ${item.stock} units`).join("\n");

        const ai = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a certified SAP Business One consultant and internal assistant for Crown Paints Limited.
Explain inventory data clearly, professionally, and in structured format.
`
            },
            { role: "user", content: context }
          ]
        });

        return res.json({ reply: ai.choices[0].message.content });
      });
      return;
    }

    // 🟡 CUSTOMER
    if (intent === "customer" && dbNeeded) {
      db.query("SELECT name, credit_limit, balance, region FROM customers", async (err, customers) => {
        if (err) return res.json({ reply: "Database error retrieving customers." });

        const found = customers.find(c => userMessage.toLowerCase().includes(c.name.toLowerCase()));

        const context = found
          ? `Customer: ${found.name}\nRegion: ${found.region}\nCredit Limit: ${found.credit_limit}\nBalance: ${found.balance}`
          : customers.map(c => `${c.name} — Balance: ${c.balance}`).join("\n");

        const ai = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a certified SAP Business One consultant and internal assistant for Crown Paints Limited.
Explain customer financial data clearly and professionally.
`
            },
            { role: "user", content: context }
          ]
        });

        return res.json({ reply: ai.choices[0].message.content });
      });
      return;
    }

    // 🟠 INVOICE
    if (intent === "invoice" && dbNeeded) {
      db.query("SELECT invoice_no, customer_name, status, amount FROM invoices", async (err, invoices) => {
        if (err) return res.json({ reply: "Database error retrieving invoices." });

        const summary = invoices.map(inv =>
          `Invoice ${inv.invoice_no} — ${inv.customer_name} — ${inv.status} — ${inv.amount}`
        ).join("\n");

        const ai = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a certified SAP Business One consultant and internal assistant for Crown Paints Limited.
Explain invoice report professionally with insights.
`
            },
            { role: "user", content: summary }
          ]
        });

        return res.json({ reply: ai.choices[0].message.content });
      });
      return;
    }

    // 🔵 SALES
    if (intent === "sales" && dbNeeded) {
      db.query("SELECT order_no, customer_name, total FROM sales_orders", async (err, orders) => {
        if (err) return res.json({ reply: "Database error retrieving sales." });

        const summary = orders.map(o => `Order ${o.order_no} — ${o.customer_name} — ${o.total}`).join("\n");

        const ai = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a certified SAP Business One consultant and internal assistant for Crown Paints Limited.
Explain sales performance clearly and professionally.
`
            },
            { role: "user", content: summary }
          ]
        });

        return res.json({ reply: ai.choices[0].message.content });
      });
      return;
    }

    // 🟣 SAP HELP / PROCEDURAL QUESTIONS
    if (intent === "sap_help") {
      const ai = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a certified SAP Business One consultant and internal assistant for Crown Paints Limited.
When explaining SAP procedures:
- Use clear numbered steps
- Include menu navigation paths
- Be professional and structured
- Assume the user is a staff member
Provide step-by-step SAP Business One instructions.
`
          },
          { role: "user", content: userMessage }
        ]
      });

      return res.json({ reply: ai.choices[0].message.content });
    }

    // 🟤 GENERAL BUSINESS / SAP KNOWLEDGE
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are a certified SAP Business One consultant for Crown Paints Limited. Provide professional business-level responses.` },
        { role: "user", content: userMessage }
      ]
    });

    res.json({ reply: ai.choices[0].message.content });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 8️⃣ Start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});