# Lab 26 Solution: Building a Content Moderation Assistant

## Goal

This file contains the complete code for the `agent.py` script in the Content Moderation Assistant lab.

### `content-moderator/agent.py`

```python
"""
Content Moderation Assistant - Demonstrates Callbacks & Guardrails

This agent uses:
- Guardrails: Block inappropriate content (before_model_callback)
- Validation: Check tool arguments (before_tool_callback)
- Logging: Track all operations (multiple callbacks)
- Modification: Add safety instructions (before_model_callback)
- Filtering: Remove PII from responses (after_model_callback)
- Metrics: Track usage statistics (state management)
"""

from google.adk.agents import Agent, CallbackContext
from google.adk.tools.tool_context import ToolContext
from google.genai import types
from typing import Dict, Any, Optional
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================ 
# BLOCKLIST CONFIGURATION
# ============================================================================ 

# Simplified blocklist for demonstration
BLOCKED_WORDS = [
    'profanity1', 'profanity2', 'hate-speech',  # Replace with real terms
    'offensive-term', 'inappropriate-word'
]

# PII patterns to filter
PII_PATTERNS = {
    'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
    'credit_card': r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
}

# ============================================================================ 
# CALLBACK FUNCTIONS
# ============================================================================ 

def before_agent_callback(callback_context: CallbackContext) -> Optional[types.Content]:
    """
    Called before agent starts processing a request.
    """
    logger.info(f"[AGENT START] Session: {callback_context.invocation_id}")
    if callback_context.state.get('app:maintenance_mode', False):
        logger.warning("[AGENT BLOCKED] Maintenance mode active")
        return types.Content(
            parts=[types.Part(text="System is currently under maintenance. Please try again later.")],
            role="model"
        )
    count = callback_context.state.get('user:request_count', 0)
    callback_context.state['user:request_count'] = count + 1
    return None

def after_agent_callback(callback_context: CallbackContext, content: types.Content) -> Optional[types.Content]:
    """
    Called after agent completes processing.
    """
    logger.info(f"[AGENT COMPLETE] Generated {len(content.parts)} parts")
    callback_context.state['temp:agent_completed'] = True
    return None

def before_model_callback(
    callback_context: CallbackContext,
    llm_request: types.GenerateContentRequest
) -> Optional[types.GenerateContentResponse]:
    """
    Called before sending request to LLM.
    """
    user_text = ""
    for content in llm_request.contents:
        for part in content.parts:
            if part.text:
                user_text += part.text
    logger.info(f"[LLM REQUEST] Length: {len(user_text)} chars")

    for word in BLOCKED_WORDS:
        if word.lower() in user_text.lower():
            logger.warning(f"[LLM BLOCKED] Found blocked word: {word}")
            blocked_count = callback_context.state.get('user:blocked_requests', 0)
            callback_context.state['user:blocked_requests'] = blocked_count + 1
            return types.GenerateContentResponse(
                candidates=[
                    types.Candidate(
                        content=types.Content(
                            parts=[types.Part(
                                text="I cannot process this request as it contains inappropriate content. Please rephrase respectfully."
                            )],
                            role="model"
                        )
                    )
                ]
            )

    safety_instruction = "\n\nIMPORTANT: Do not generate harmful, biased, or inappropriate content."
    if llm_request.config and llm_request.config.system_instruction:
        llm_request.config.system_instruction += safety_instruction
    llm_count = callback_context.state.get('user:llm_calls', 0)
    callback_context.state['user:llm_calls'] = llm_count + 1
    return None

def after_model_callback(
    callback_context: CallbackContext,
    llm_response: types.GenerateContentResponse
) -> Optional[types.GenerateContentResponse]:
    """
    Called after receiving response from LLM.
    """
    response_text = ""
    if llm_response.candidates:
        for part in llm_response.candidates[0].content.parts:
            if part.text:
                response_text += part.text
    logger.info(f"[LLM RESPONSE] Length: {len(response_text)} chars")

    filtered_text = response_text
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.findall(pattern, filtered_text)
        if matches:
            logger.warning(f"[FILTERED] Found {len(matches)} {pii_type} instances")
            filtered_text = re.sub(pattern, f'[{pii_type.upper()}_REDACTED]', filtered_text)

    if filtered_text != response_text:
        return types.GenerateContentResponse(
            candidates=[
                types.Candidate(
                    content=types.Content(
                        parts=[types.Part(text=filtered_text)],
                        role="model"
                    )
                )
            ]
        )
    return None

def before_tool_callback(
    callback_context: CallbackContext,
    tool_name: str,
    args: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Called before executing a tool.
    """
    logger.info(f"[TOOL CALL] {tool_name} with args: {args}")
    if tool_name == 'generate_text':
        word_count = args.get('word_count', 0)
        if word_count <= 0 or word_count > 5000:
            logger.warning(f"[TOOL BLOCKED] Invalid word_count: {word_count}")
            return {
                'status': 'error',
                'message': f'Invalid word_count: {word_count}. Must be between 1 and 5000.'
            }
    tool_count = callback_context.state.get(f'user:tool_{tool_name}_count', 0)
    callback_context.state[f'user:tool_{tool_name}_count'] = tool_count + 1
    callback_context.state['temp:last_tool'] = tool_name
    return None

def after_tool_callback(
    callback_context: CallbackContext,
    tool_name: str,
    tool_response: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Called after tool execution completes.
    """
    logger.info(f"[TOOL RESULT] {tool_name}: {tool_response.get('status', 'unknown')}")
    callback_context.state['temp:last_tool_result'] = str(tool_response)
    return None

# ============================================================================ 
# TOOLS
# ============================================================================ 

def generate_text(topic: str, word_count: int, tool_context: ToolContext) -> Dict[str, Any]:
    """Generates text on a topic with a specified word count."""
    return {'status': 'success', 'message': f'Generated {word_count}-word article on "{topic}"'
}

def check_grammar(text: str, tool_context: ToolContext) -> Dict[str, Any]:
    """Checks grammar and provides corrections."""
    issues_found = len(text.split()) // 10
    return {'status': 'success', 'issues_found': issues_found}

def get_usage_stats(tool_context: ToolContext) -> Dict[str, Any]:
    """Gets user's usage statistics from state."""
    return {
        'status': 'success',
        'request_count': tool_context.state.get('user:request_count', 0),
        'llm_calls': tool_context.state.get('user:llm_calls', 0),
        'blocked_requests': tool_context.state.get('user:blocked_requests', 0),
        'tool_generate_text_count': tool_context.state.get('user:tool_generate_text_count', 0),
        'tool_check_grammar_count': tool_context.state.get('user:tool_check_grammar_count', 0)
    }

# ============================================================================ 
# AGENT DEFINITION
# ============================================================================ 

root_agent = Agent(
    name="content_moderator",
    model="gemini-2.5-flash",
    description="Content moderation assistant with safety guardrails, validation, and monitoring.",
    instruction="You are a writing assistant. You can generate text, check grammar, and provide usage stats.",
    tools=[generate_text, check_grammar, get_usage_stats],
    before_agent_callback=before_agent_callback,
    after_agent_callback=after_agent_callback,
    before_model_callback=before_model_callback,
    after_model_callback=after_model_callback,
    before_tool_callback=before_tool_callback,
    after_tool_callback=after_tool_callback,
    output_key="last_response"
)

# --- Main Execution Block (for `adk web`) ---
def main():
    """Demonstrates how to register plugins with the runner."""
    # In this lab, callbacks are registered directly with the agent, not as plugins.
    # The `adk web` command will automatically discover the `root_agent`.
    print("Agent with callbacks is configured.")
    print("Run `adk web content-moderator` from the parent directory and interact with the agent to see callback output in the console.")

if __name__ == "__main__":
    main()
```

### Self-Reflection Answers

1.  **What is the key difference between a callback and a plugin in the ADK? When would you choose one over the other?**
    *   **Answer:** The key difference lies in their scope and primary role. **Callbacks** are agent-specific, designed for control, modification, and implementing guardrails *within a single agent's logic*. They can block or alter an agent's execution. **Plugins** are global (registered at the `Runner` level), designed for observation and telemetry (metrics, logging, alerting) *across all agents in an application*. Choose a callback to modify or block an agent's specific operations; choose a plugin to monitor behavior across the entire system without altering its logic.

2.  **The `before_model_callback` returns a `GenerateContentResponse` to block an inappropriate prompt. Why is it important to return a specific object type here instead of just a string or a dictionary?**
    *   **Answer:** When a callback (like `before_model_callback`) returns a specific object type (e.g., `types.GenerateContentResponse`), it signals a clear override instruction to the ADK framework. This allows the framework to skip the standard operation (like calling the LLM) and use the returned object as a direct substitute, ensuring the data flow remains consistent and predictable. Returning a simple string or dictionary would break this control flow, as the framework would not know how to handle the unstructured data in the context of an LLM response.

3.  **How does using callbacks for guardrails and validation make an agent more reliable and safer to deploy in a production environment?**
    *   **Answer:** Callbacks significantly enhance reliability and safety by introducing deterministic, hard-coded checks for critical functionalities, reducing reliance on the LLM's non-deterministic reasoning. For instance, `before_model_callback` can proactively prevent harmful input from reaching the LLM, and `after_model_callback` can filter sensitive data (PII) from responses before they are exposed. Similarly, `before_tool_callback` validates tool arguments, preventing runtime errors and ensuring tools are used correctly. This layered approach creates a more stable, secure, and predictable agent behavior in production.
