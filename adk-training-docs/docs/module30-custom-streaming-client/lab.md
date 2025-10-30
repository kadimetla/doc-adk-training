---
sidebar_position: 2
---
---
## Module 30: Building a Custom Streaming Client

# Lab 30: Solution

# Lab 30: Solution

This file contains the complete, working code for the `index.html` custom client.

### `custom-streaming-app/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>ADK Custom Streaming Client</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; }
        #status { margin: 10px; padding: 10px; border: 1px solid #ccc; }
        #transcript { width: 500px; height: 300px; border: 1px solid #ccc; padding: 10px; overflow-y: scroll; background-color: #f9f9f9; }
        p { margin: 5px 0; }
        button { margin: 10px; padding: 10px; font-size: 16px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>ADK Custom Streaming Client</h1>
    <button id="streamButton">Start Streaming</button>
    <div id="status">Status: Disconnected</div>
    <div id="transcript"></div>

    <script>
        const streamButton = document.getElementById('streamButton');
        const statusDiv = document.getElementById('status');
        const transcriptDiv = document.getElementById('transcript');

        let websocket;
        let audioContext;
        let mediaStream;
        let mediaRecorder;
        let isStreaming = false;

        streamButton.onclick = () => {
            if (!isStreaming) {
                startStreaming();
            } else {
                stopStreaming();
            }
        };

        function log(message) {
            const p = document.createElement('p');
            p.textContent = message;
            transcriptDiv.appendChild(p);
            transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
        }

        async function startStreaming() {
            try {
                // 1. Get microphone access
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // 2. Establish WebSocket connection
                const sessionId = Math.random().toString(36).substring(7);
                const wsUrl = `ws://localhost:8000/live/${sessionId}?is_audio=true`;
                websocket = new WebSocket(wsUrl);

                websocket.onopen = () => {
                    isStreaming = true;
                    streamButton.textContent = 'Stop Streaming';
                    statusDiv.textContent = 'Status: Connected';
                    log('[CLIENT]: WebSocket connection opened.');

                    // 3. Start recording and sending audio
                    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm;codecs=opus' });
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0 && websocket.readyState === WebSocket.OPEN) {
                            websocket.send(event.data);
                        }
                    };
                    mediaRecorder.start(100); // Send data every 100ms
                };

                websocket.onmessage = (event) => {
                    // 4. Handle incoming messages (agent's response)
                    const data = JSON.parse(event.data);
                    if (data.mime_type === 'text/plain') {
                        log(`[AGENT]: ${data.data}`);
                    }
                    // A production client would also handle 'audio/mp3' mime_type for playback.
                };

                websocket.onclose = () => {
                    log('[CLIENT]: WebSocket connection closed.');
                    stopStreaming();
                };

                websocket.onerror = (error) => {
                    log(`[CLIENT]: WebSocket Error: ${JSON.stringify(error)}`);
                    stopStreaming();
                };

            } catch (error) {
                log(`[CLIENT]: Error starting stream: ${error}`);
            }
        }

        function stopStreaming() {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
            isStreaming = false;
            streamButton.textContent = 'Start Streaming';
            statusDiv.textContent = 'Status: Disconnected';
        }
    </script>
</body>
</html>
```

### Troubleshooting

*   **"WebSocket connection to 'ws://localhost:8000/...' failed":**
    *   **Cause:** The ADK `api_server` is not running or is running on a different port.
    *   **Solution:** Make sure you have a terminal window running `adk api_server` in your `streaming_agent` directory.

*   **"NotAllowedError: Permission denied" in browser console:**
    *   **Cause:** You denied the browser's request to access your microphone.
    *   **Solution:** Go into your browser's site settings for `localhost:8081` and change the Microphone permission to "Allow".

*   **Connection opens but agent doesn't respond:**
    *   **Cause:** The agent server may have encountered an error. This is often because the `.env` file is not configured for Vertex AI.
    *   **Solution:** Check the terminal window running `adk api_server` for any error messages. Ensure your `streaming_agent/.env` file is correctly configured with your Vertex AI project details.
