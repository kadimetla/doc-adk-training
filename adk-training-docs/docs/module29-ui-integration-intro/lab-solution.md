---
---
## Module 29: Introduction to UI Integration

# Lab 29: Solution

# Lab 29: Solution

This file contains the complete code for the `index.html` custom chat client.

### `ui-agent/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADK Custom UI</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; margin: 0; }
        #chat-container { flex: 1; overflow-y: auto; padding: 20px; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 10px; max-width: 80%; }
        .user { background-color: #dcf8c6; align-self: flex-end; }
        .assistant { background-color: #f1f0f0; align-self: flex-start; }
        #input-form { display: flex; padding: 20px; border-top: 1px solid #ccc; }
        input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        button { padding: 10px 20px; margin-left: 10px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div id="chat-container"></div>
    <form id="input-form">
        <input type="text" id="message-input" placeholder="Type your message..." autocomplete="off">
        <button type="submit">Send</button>
    </form>

    <script>
        const chatContainer = document.getElementById('chat-container');
        const inputForm = document.getElementById('input-form');
        const messageInput = document.getElementById('message-input');
        const sessionId = `session-${Date.now()}`; // Simple session ID for this example

        inputForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = messageInput.value.trim();
            if (!query) return;

            addMessage(query, 'user');
            messageInput.value = '';

            const assistantMessageDiv = addMessage('', 'assistant');
            
            try {
                const response = await fetch('http://localhost:8080/run_sse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        app_name: "ui-agent",
                        session_id: sessionId,
                        new_message: {
                            role: "user",
                            parts: [{ "text": query }]
                        }
                    })
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullResponse = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    // SSE sends data in "data: {...}\n\n" format. We need to parse it.
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.substring(6);
                            if (jsonStr.trim()) {
                                const eventData = JSON.parse(jsonStr);
                                if (eventData.content && eventData.content.parts) {
                                    const textChunk = eventData.content.parts[0].text || '';
                                    fullResponse += textChunk;
                                    assistantMessageDiv.textContent = fullResponse;
                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                assistantMessageDiv.textContent = 'Error: Could not connect to the agent.';
                console.error('Error:', error);
            }
        });

        function addMessage(text, role) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', role);
            messageDiv.textContent = text;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            return messageDiv;
        }
    </script>
</body>
</html>
```
