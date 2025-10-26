# Module 27: Advanced - Building a Personalized Shopping Agent

## Challenging Lab

### Goal

In this lab, you will build the personalized shopping agent from scratch. You will implement the tools to interact with the web environment and define the agent with its prompt.

### Setup

1.  **Copy the `personalized_shopping` agent sample** from the `sample-agents` directory to a new directory for your lab.
2.  **Follow the `README.md`** in the `personalized_shopping` directory to download the data and set up the environment.
3.  **Create a new Python package** for your agent (e.g., `my_shopping_agent`).

### Exercises

#### Exercise 1: Implement the `search` tool

Create a `search.py` file in your tools directory. In this file, implement the `search` function that takes a `keywords` string and a `tool_context` as input.

*   Get the webshop environment instance.
*   Execute the search action in the environment.
*   Save the resulting HTML as an artifact.
*   Return the observation from the environment.

```python
# your code here
```

#### Exercise 2: Implement the `click` tool

Create a `click.py` file in your tools directory. In this file, implement the `click` function that takes a `button_name` string and a `tool_context` as input.

*   Get the webshop environment instance.
*   Execute the click action in the environment.
*   Save the resulting HTML as an artifact.
*   Return the observation from the environment.

```python
# your code here
```

#### Exercise 3: Define the Agent Prompt

Create a `prompt.py` file and define the `personalized_shopping_agent_instruction` string. This prompt should guide the agent through the entire shopping process. Refer to the `theory.md` file for the required steps.

```python
# your code here
```

#### Exercise 4: Create the Agent

Create an `agent.py` file. In this file:

*   Import the `Agent` and `FunctionTool` classes.
*   Import your `search` and `click` tools.
*   Import your agent instruction prompt.
*   Define the `root_agent` with the `gemini-1.5-flash` model, a name, the instruction prompt, and the `search` and `click` tools.

```python
# your code here
```

### Running the Agent

Once you have completed all the exercises, you can run your agent using the ADK CLI:

```bash
adk run my_shopping_agent
```

Or with the web UI:

```bash
adk web
```

Good luck!
