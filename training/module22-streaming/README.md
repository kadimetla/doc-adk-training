# Module 22: Real-time Interaction with Streaming

## Theory

### Beyond Turn-based Conversation

Traditional chat interactions are **turn-based**. The user sends a complete message, waits for the agent to process it and generate a full response, and then the agent sends its complete message back. This request-response cycle is simple and effective for many text-based tasks.

However, this model falls short when it comes to creating truly natural, human-like interactions. Streaming provides **progressive output** as the model generates text, which feels faster and more conversational.

**Without Streaming (Blocking):**
```
User: "Explain quantum computing"
Agent: [5 seconds of waiting...]
       [Complete response appears at once]
```

**With Streaming (Progressive):**
```
User: "Explain quantum computing"
Agent: "Quantum computing is a revolutionary..."
       [Text appears word-by-word as it's generated]
```

### 1. Text Streaming with Server-Sent Events (SSE)

The most common type of streaming is for text-based chat. The ADK enables this using **Server-Sent Events (SSE)**, a standard protocol for servers to push data to clients over HTTP.

When you enable SSE streaming, the agent sends its response back in small chunks as the LLM generates them. This is perfect for web-based chat interfaces where you want to display the response as if it's being typed out in real-time.

This is configured in the ADK using `RunConfig` and `StreamingMode.SSE`.

### 2. The Power of Bidirectional Streaming

For voice and video, an even more advanced form of streaming is needed. The ADK brings a natural, human-like conversational flow to your agents through its integration with the **Gemini Live API**, enabling **bidirectional streaming** (or "bidi-streaming").

Unlike one-way SSE, bidirectional streaming is a continuous, two-way flow of information.

**Here's how it works:**

1.  **Continuous Input:** The user's microphone (or camera) continuously streams audio (or video) data to the agent in small chunks.
2.  **Real-time Processing:** The agent's LLM begins processing this incoming stream *as it arrives*, formulating a response before the user has even finished their sentence.
3.  **Interruptibility:** Because the agent is processing in real-time, it can detect when the user starts speaking again and immediately stop its own response to listen. This allows the user to interrupt the agent, change their mind, or clarify something, just like in a human conversation.
4.  **Low Latency:** The agent can start sending its own audio response back to the user's speakers the moment it has formulated the beginning of a sentence, dramatically reducing the perceived delay.

### Key Concepts

*   **SSE:** One-way streaming of text chunks from server to client. Ideal for chat.
*   **Bidirectional:** Data is flowing in both directions (user to agent, agent to user) simultaneously. Ideal for voice.
*   **Low Latency:** The time between the user speaking and the agent responding is minimized.
*   **Interruptibility:** The user can interrupt the agent, and the agent can gracefully handle the interruption.

In the lab, you will get to experience both of these streaming modes.
