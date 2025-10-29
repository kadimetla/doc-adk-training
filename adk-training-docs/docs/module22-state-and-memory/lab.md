---
sidebar_position: 2
---
# Module 20: State and Memory - Building a Personal Tutor Agent

## Lab 22: Exercise

### Goal

In this lab, you will build a **Personal Learning Tutor** that uses all four state scopes (`user:`, `app:`, session, and `temp:`) and simulates interacting with a long-term memory service. This will teach you how to create a truly stateful and personalized agent.

### The Use Case

You will build a tutor that:
*   Stores a user's preferences (language, difficulty) in **`user:`** state.
*   Tracks the current topic in **session** state.
*   Uses **`temp:`** state for an intermediate quiz calculation.
*   Reads a global "course version" from **`app:`** state.
*   Simulates searching its **long-term memory** for past lessons.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create personal-tutor
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd personal-tutor
    ```

### Step 2: Implement the State-Management Tools

**Exercise:** Open `agent.py`. You will find a skeleton script. Your task is to complete the tool functions by using the correct state prefixes (`user:`, `temp:`, or no prefix) based on the requirements in the docstrings.

```python
# agent.py (Starter Code)

from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
from typing import Dict, Any

# ============================================================================
# TOOLS: State Management & Memory Operations
# ============================================================================

def set_user_preferences(
    language: str,
    difficulty_level: str,
    tool_context: ToolContext
) -> Dict[str, Any]:
    """
    Set user learning preferences that should be stored persistently
    across all sessions for the current user.
    """
    # TODO: Store the language and difficulty_level in the tool_context.state.
    # Use the correct prefix for data that should persist for the user.
    print(f"TODO: Set user preferences: {language}, {difficulty_level}")
    return {'status': 'success', 'message': 'Preferences saved!'}


def start_learning_session(
    topic: str,
    tool_context: ToolContext
) -> Dict[str, Any]:
    """
    Start a new learning session. The current topic should only be
    remembered for the duration of the current conversation session.
    """
    # TODO: Store the topic in the tool_context.state.
    # Use the correct prefix for data that should only last for one session.
    print(f"TODO: Start session on topic: {topic}")
    return {'status': 'success', 'message': f'Started learning session: {topic}'}


def calculate_quiz_grade(
    correct_answers: int,
    total_questions: int,
    tool_context: ToolContext
) -> Dict[str, Any]:
    """
    Calculate a quiz grade. The raw percentage should be stored, but only
    for the current turn. It should be discarded immediately after this
    tool finishes.
    """
    percentage = (correct_answers / total_questions) * 100
    # TODO: Store the 'percentage' in the tool_context.state.
    # Use the correct prefix for data that is temporary for one turn.
    print(f"TODO: Calculate quiz grade. Percentage: {percentage}")
    return {'status': 'success', 'percentage': round(percentage, 1)}


# (Other tools like record_topic_completion, get_user_progress, etc. would also be completed here)

# ============================================================================
# AGENT DEFINITION
# ============================================================================

# TODO: Define the root_agent, including the tools you have just implemented.
# Make sure the agent's instruction can read an `app:course_version` from the state.

```

### Step 3: Run and Test the State Scopes

1.  **Set up your API key** in the `.env` file.
2.  **Start the Dev UI:** `adk web`
3.  **Interact with the agent:**
    *   Go to the **State** tab. Set the global app state by entering `{"app:course_version": "2.1"}` and clicking "Set State".
    *   Go back to the **Chat** tab and test your agent. Ask it to set your preferences, start a lesson, and check your progress.
    *   Start a new session (refresh the page) and verify that your preferences were remembered but the current lesson topic was forgotten.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built a sophisticated agent that leverages all four state scopes to provide a continuous, personalized experience. You have learned:
*   How to use `user:` state for persistent user preferences.
*   How to use session state for conversation-specific context.
*   How to use `temp:` state for single-turn, intermediate data.
*   How to use `app:` state for global, application-wide data.
*   How these state mechanisms work together to create agents with memory.
