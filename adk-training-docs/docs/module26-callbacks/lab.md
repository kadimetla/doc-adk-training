---
sidebar_position: 2
---
# Module 28: Callbacks and Guardrails - Building a Content Moderator

## Lab 26: Exercise

### Goal

In this lab, you will implement a full suite of callbacks to create a **Content Moderation Assistant**. This agent will demonstrate how to build production-grade safety guardrails, validation, logging, and response filtering.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create content-moderator
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd content-moderator
    ```

### Step 2: Implement the Callbacks

**Exercise:** Open `agent.py`. Skeletons for the callback functions are provided. Your task is to implement the logic for each one based on the `# TODO` comments, and then register them with the agent.

```python
# In agent.py (Starter Code)

from google.adk.agents import Agent, CallbackContext
from google.genai import types
from typing import Dict, Any, Optional
import logging

# (Blocklist and PII patterns are provided for you)
BLOCKED_WORDS = ['inappropriate-word']
PII_PATTERNS = {'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'}

# ============================================================================ 
# CALLBACK FUNCTIONS
# ============================================================================ 

def before_model_callback(
    callback_context: CallbackContext,
    llm_request: types.GenerateContentRequest
) -> Optional[types.GenerateContentResponse]:
    """Input Guardrail: Blocks requests containing inappropriate words."""
    user_text = llm_request.contents[-1].parts[0].text
    
    # TODO: 1. Loop through BLOCKED_WORDS.
    # TODO: 2. If a blocked word is in `user_text`:
    #    a. Log a warning.
    #    b. Return a `types.GenerateContentResponse` with a safety message
    #       to block the LLM call and override the response.
    
    # TODO: 3. If no blocked words are found, return None to continue.
    return None

def before_tool_callback(
    callback_context: CallbackContext,
    tool_name: str,
    args: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """Argument Validation: Blocks tool calls with invalid arguments."""
    # TODO: 4. Check if the `tool_name` is 'generate_text'.
    # TODO: 5. If it is, get the `word_count` from the `args`.
    # TODO: 6. If `word_count` is not between 1 and 5000:
    #    a. Log a warning.
    #    b. Return an error dictionary to block the tool call, like:
    #       {'status': 'error', 'message': 'Invalid word_count...'}
    
    # TODO: 7. If arguments are valid, return None.
    return None

def after_model_callback(
    callback_context: CallbackContext,
    llm_response: types.GenerateContentResponse
) -> Optional[types.GenerateContentResponse]:
    """Output Filtering: Removes PII from LLM responses."""
    response_text = llm_response.candidates[0].content.parts[0].text
    
    # TODO: 8. Use the `re.sub` function with the `PII_PATTERNS` to replace
    # any found PII in `response_text` with '[REDACTED]'.
    # TODO: 9. If the text was changed, construct and return a new
    # `types.GenerateContentResponse` with the filtered text.
    # TODO: 10. If no changes were made, return None.
    return None

# (Other callbacks for logging are in the solution file for reference)

# ============================================================================ 
# AGENT DEFINITION
# ============================================================================ 

# (Tools are provided for you)
def generate_text(topic: str, word_count: int) -> Dict[str, Any]:
    """Generates text on a topic."""
    return {'status': 'success', 'message': f'Generated {word_count}-word article.'}

# TODO: 11. Register your three implemented callback functions with the Agent.
root_agent = Agent(
    name="content_moderator",
    model="gemini-1.5-flash",
    tools=[generate_text],
    # before_model_callback=...
    # before_tool_callback=...
    # after_model_callback=...
)
```

### Step 3: Run and Test the Guardrails

1.  **Set up your `.env` file** and start the Dev UI: `adk web`
2.  **Interact with the agent and test your guardrails:**
    *   **Blocked Request:** "Write about inappropriate-word." (Should be blocked by `before_model_callback`).
    *   **Invalid Argument:** "Generate an article with -50 words." (Should be blocked by `before_tool_callback`).
    *   **PII Filtering:** "My email is test@example.com, what do you think?" (The final response should be redacted by `after_model_callback`).

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary
You have built an agent with a suite of safety guardrails. You have learned to:
*   Implement an input guardrail with `before_model_callback`.
*   Validate tool arguments with `before_tool_callback`.
*   Filter sensitive information from responses with `after_model_callback`.
*   Use the "return an object to override" control flow pattern.