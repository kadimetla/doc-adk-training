# Module 22: Real-time Interaction with Streaming

## Lab 22: Solution

This file contains the complete code for the `stream_text.py` script used in Part 2 of the lab.

### `stream_text.py`

```python
import asyncio
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.sessions import Session
from google.genai import types

# 1. Define Your Agent
# For this programmatic script, we define the agent directly in Python.
# Note: This agent does NOT need `streaming: True`, as that's for bidi-streaming.
# SSE streaming is configured in the RunConfig instead.
root_agent = Agent(
    model="gemini-1.5-flash",
    name="text_streamer",
    instruction="You are a helpful assistant. Provide detailed and informative answers.",
)

async def main():
    # 2. Create a Runner and a Session
    runner = Runner(agent=root_agent)
    session = Session()

    # 3. Configure the Runner for SSE Streaming
    sse_run_config = RunConfig(
        streaming_mode=StreamingMode.SSE
    )

    query = "Explain Server-Sent Events in the context of web development."
    print(f"User: {query}\n")
    print("Agent: ", end="", flush=True)

    # 4. Run the agent and iterate through the async events
    async for event in runner.run_async(
        new_message=types.Content(role="user", parts=[types.Part(text=query)]),
        session=session,
        run_config=sse_run_config,
    ):
        # 5. Print the text from each part as it arrives
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    print(part.text, end="", flush=True)
    
    print() # Final newline

if __name__ == "__main__":
    # Load environment variables from .env file
    # Ensure you have GOOGLE_API_KEY or Vertex AI configured
    from dotenv import load_dotenv
    load_dotenv()
    
    asyncio.run(main())
```

```