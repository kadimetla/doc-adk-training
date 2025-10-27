# Module 22: Real-time Interaction with Streaming

## Lab 22: Exploring Streaming Modes

### Goal
In this lab, you will explore both bidirectional (voice) and Server-Sent Event (text) streaming to understand how to create more responsive, real-time agent interactions.

---

## Part 1: Bidirectional Streaming (Voice)

In this part, you will enable streaming mode in a config-based agent and interact with it using your voice in the Dev UI to experience low-latency, interruptible conversation.

### Prerequisites
*   A working microphone.
*   Browser permission to access your microphone.

### Step 1: Create the Streaming Agent Project
```shell
adk create --type=config streaming-agent
cd streaming-agent
```

### Step 2: Configure the Agent for Bidi-Streaming
1.  **Set up for Vertex AI:** Open the `.env` file. Streaming requires a Vertex AI setup.
    ```
    GOOGLE_GENAI_USE_VERTEXAI=1
    GOOGLE_CLOUD_PROJECT=<your_gcp_project>
    GOOGLE_CLOUD_LOCATION=us-central1
    ```
2.  **Update `root_agent.yaml`:** Replace the contents with the following. The key is the `streaming: True` flag.
    ```yaml
    name: streaming_conversational_agent
    model: gemini-1.5-flash
    instruction: |
      You are a friendly and talkative assistant. Keep your answers concise
      and conversational. Your goal is to have a natural, flowing conversation.
    streaming: True
    ```

### Step 3: Test Voice Interaction
1.  **Start the web server:** `adk web`
2.  **Interact with your voice:**
    *   Open the Dev UI. Click and hold the microphone icon to speak.
    *   Ask a question like, "Tell me a fun fact about the ocean."
3.  **Test Interruptibility:**
    *   Ask a longer question, like "Give me a brief summary of the plot of the first Star Wars movie."
    *   As soon as the agent starts speaking, interrupt it by clicking the microphone and saying, "Actually, stop. Tell me about The Empire Strikes Back instead."
    *   Observe that the agent stops its first response and immediately listens to your new request.

---

## Part 2: SSE Text Streaming (Programmatic)

In this part, you will write a Python script to run an agent programmatically and print its text response chunk-by-chunk as it's generated.

### Step 1: Create the Script
Inside your `streaming-agent` directory, create a new file named `stream_text.py`.

### Step 2: Implement the Streaming Client

**Exercise:** Open `stream_text.py`. Your task is to write the Python code to run an agent with SSE streaming. Use the `# TODO` comments below as your guide.

```python
# In stream_text.py (Starter Code)
import asyncio
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.sessions import Session
from google.genai import types

# TODO: 1. Define a simple `Agent` named "text_streamer".
root_agent = None

async def main():
    runner = Runner(agent=root_agent)
    session = Session()

    # TODO: 2. Create a `RunConfig` instance.
    # Set its `streaming_mode` to `StreamingMode.SSE`.
    sse_run_config = None

    query = "Explain Server-Sent Events in the context of web development."
    print(f"User: {query}\n\nAgent: ", end="", flush=True)

    # TODO: 3. Call `runner.run_async`. Pass in the `sse_run_config`.
    # TODO: 4. Write an `async for` loop to iterate through the events.
    # TODO: 5. Inside the loop, check for `event.content.parts` and print
    # the `part.text` of each part. Use `end=""` and `flush=True` in your
    # print statement to see the streaming effect.
    
    print() # Final newline

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(main())
```

### Step 3: Run and Test the Script
Run your script from the terminal.
```shell
uv run python stream_text.py
```
You should see the agent's response printed to the console word-by-word, demonstrating SSE streaming.

### Having Trouble?

The complete, working code for Part 2 is available in the `lab-solution.md` file.

### Lab Summary
You have now experienced both bidirectional (voice) and SSE (text) streaming. You have learned to:
*   Enable bidirectional streaming for a config-based agent using `streaming: True`.
*   Test interruptible voice conversations in the Dev UI.
*   Write a Python script to programmatically run an agent with `StreamingMode.SSE`.
*   Process and display progressive text output from a streaming agent.