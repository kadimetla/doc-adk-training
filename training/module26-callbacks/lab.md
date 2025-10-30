# Module 26: Callbacks and Guardrails - Building a Content Moderator

## Lab 26: Building a Content Moderation Assistant

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

**Exercise:** Open `agent.py`. The full starter code is provided below. Your task is to implement the logic inside the `# TODO` comments for each callback function, and then register them with the agent.

```python
# In agent.py (Starter Code)

from google.adk.agents import Agent, CallbackContext, InMemoryRunner
from google.adk.tools.tool_context import ToolContext
from google.genai import types
from typing import Dict, Any, Optional, List
import re
import logging
import time
from dataclasses import dataclass, field

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

# --- Data Classes for Metrics (for logging purposes) ---
@dataclass
class RequestMetrics:
    """Metrics for a single agent request."""
    request_id: str
    start_time: float
    end_time: Optional[float] = None
    latency: Optional[float] = None
    success: bool = True
    error: Optional[str] = None

@dataclass
class AggregateMetrics:
    """Aggregate metrics across all requests."""
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    total_latency: float = 0.0
    requests: List[RequestMetrics] = field(default_factory=list)

    @property
    def success_rate(self) -> float:
        if self.total_requests == 0: return 0.0
        return self.successful_requests / self.total_requests

    @property
    def avg_latency(self) -> float:
        if self.total_requests == 0: return 0.0
        return self.total_latency / self.total_requests

# ============================================================================ 
# CALLBACK FUNCTIONS
# ============================================================================ 

def before_agent_callback(callback_context: CallbackContext) -> Optional[types.Content]:
    """
    Called before agent starts processing a request.
    TODO: 1. Log agent start and increment a user-specific request count.
    TODO: 2. Implement a maintenance mode guardrail: if 'app:maintenance_mode' is True in state,
       block the agent and return a canned response.
    """
    logger.info(f"[AGENT START] Session: {callback_context.invocation_id}")
    if callback_context.state.get('app:maintenance_mode', False):
        logger.warning("[AGENT BLOCKED] Maintenance mode active")
        return types.Content(
            parts=[types.Part(
                text="System is currently under maintenance. Please try again later."
            )],
            role="model"
        )
    count = callback_context.state.get('user:request_count', 0)
    callback_context.state['user:request_count'] = count + 1
    return None

def after_agent_callback(callback_context: CallbackContext, content: types.Content) -> Optional[types.Content]:
    """
    Called after agent completes processing.
    TODO: 3. Log agent completion.
    """
    logger.info(f"[AGENT COMPLETE] Generated {len(content.parts)} parts")
    callback_context.state['temp:agent_completed'] = True
    return None

def before_model_callback(
    callback_context: CallbackContext,
    llm_request: types.GenerateContentRequest
) -> Optional[types.GenerateContentResponse]:
    """
    Input Guardrail: Blocks requests containing inappropriate words.
    TODO: 4. Loop through BLOCKED_WORDS. If a blocked word is in `user_text`:
       a. Log a warning.
       b. Increment a user-specific 'blocked_requests' count in state.
       c. Return a `types.GenerateContentResponse` with a safety message to block the LLM call.
    TODO: 5. Add a general safety instruction to the LLM request's system_instruction.
    TODO: 6. Increment a user-specific 'llm_calls' count in state.
    TODO: 7. If no blocked words are found, return None to continue.
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
                            parts=[
                                types.Part(
                                    text="I cannot process this request as it contains inappropriate content. Please rephrase respectfully."
                                )
                            ],
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
    Output Filtering: Removes PII from LLM responses.
    TODO: 8. Extract response text. Loop through PII_PATTERNS. Use `re.sub` to replace
       any found PII with '[PII_TYPE_REDACTED]'.
    TODO: 9. If the text was changed, construct and return a new `types.GenerateContentResponse`
       with the filtered text. Otherwise, return None.
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
                        parts=[
                            types.Part(text=filtered_text)
                        ],
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
    Argument Validation: Blocks tool calls with invalid arguments.
    TODO: 10. Log tool call. If `tool_name` is 'generate_text' and `word_count` is not
       between 1 and 5000:
       a. Log a warning.
       b. Return an error dictionary to block the tool call.
    TODO: 11. Increment a user-specific tool usage count in state.
    TODO: 12. If arguments are valid, return None.
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
    TODO: 13. Log tool result.
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
        'tool_generate_text_count': callback_context.state.get('user:tool_generate_text_count', 0),
        'tool_check_grammar_count': callback_context.state.get('user:tool_check_grammar_count', 0)
    }

# ============================================================================ 
# AGENT DEFINITION
# ============================================================================ 

# TODO: 14. Define the `root_agent`. Give it an appropriate instruction and
# register all tools and callback functions.
root_agent = Agent(
    name="content_moderator",
    model="gemini-2.5-flash",
    description="Content moderation assistant with safety guardrails, validation, and monitoring.",
    instruction="You are a writing assistant. You can generate text, check grammar, and provide usage stats.",
    tools=[
        generate_text,
        check_grammar,
        get_usage_stats
    ],
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