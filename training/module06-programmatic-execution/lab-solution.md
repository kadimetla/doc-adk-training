# Module 6: Running an Agent Programmatically

## Lab 6: Solution

This file contains the complete code for the `agent.py` script used in the lab.

### `agent.py`

```python
import asyncio
from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.sessions import Session
from google.genai import types

import os
from dotenv import load_dotenv

# 1. Load environment variables from the local .env file.
# This allows us to configure the model name without hardcoding it.
load_dotenv()
model_name = os.getenv("MODEL")

# Create an async main function to orchestrate the agent execution.
async def main():

    # 2. Define unique identifiers for our application and user.
    app_name = 'my_agent_app'
    user_id_1 = 'user1'

    # 3. Define the Agent's blueprint.
    # This includes its name, the LLM model it uses, and its core instructions.
    root_agent = Agent(
        model=model_name,
        name="trivia_agent",
        instruction="Answer questions.",
    )

    # 4. Create a Runner to manage the agent's execution lifecycle.
    # The InMemoryRunner is a simple runner that keeps sessions in memory.
    runner = InMemoryRunner(
        agent=root_agent,
        app_name=app_name,
    )

    # 5. Create a session to maintain conversational context.
    # The session stores message history for a specific user.
    my_session = await runner.session_service.create_session(
        app_name=app_name, user_id=user_id_1
    )

    # 6. Define a helper function to simplify sending messages to the agent.
    # It packages the string message, runs the agent, and prints the response.
    async def run_prompt(session: Session, new_message: str):
        # Package the user's message in the required Content/Part structure.
        content = types.Content(
                role='user', parts=[types.Part.from_text(text=new_message)]
            )
        print('** User says:', content.model_dump(exclude_none=True))
        
        # Execute the agent and loop through the asynchronous event stream.
        async for event in runner.run_async(
            user_id=user_id_1,
            session_id=session.id,
            new_message=content,
        ):
            # Print the text from the final agent response.
            if event.content.parts and event.content.parts[0].text:
                print(f'** {event.author}: {event.content.parts[0].text}')

    # 7. Use the helper function to run a query and get a response.
    query = "What is the capital of France?"
    await run_prompt(my_session, query)

# Standard Python entry point to run the async main function.
if __name__ == "__main__":
    asyncio.run(main())
```