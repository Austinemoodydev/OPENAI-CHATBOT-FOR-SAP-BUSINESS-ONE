const API_URL = "http://localhost:3000/chat";

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  // Add user message
  chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Add AI response
    chatBox.innerHTML += `<div class="ai-msg">${data.reply || data.error}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    chatBox.innerHTML += `<div class="ai-msg text-danger">Connection error</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Optional: allow Enter key to send
document.getElementById("messageInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});