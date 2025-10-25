# Module 19: State and Memory - Building a Personal Tutor Agent

## Lab 19: Building a Personal Learning Tutor

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

### Step 2: Implement the Agent and Tools

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and understand how the different state scopes are used:

1.  **`set_user_preferences` tool:** Notice how it writes to `tool_context.state['user:language']` and `tool_context.state['user:difficulty_level']`. This data will persist across sessions for the same user.

2.  **`start_learning_session` tool:** This tool writes to `tool_context.state['current_topic']` (no prefix), making it available only for the current conversation.

3.  **`calculate_quiz_grade` tool:** This tool uses `tool_context.state['temp:raw_score']` for an intermediate calculation. This data will be discarded immediately after the current turn is complete.

4.  **`get_user_progress` tool:** This tool reads from multiple `user:` prefixed keys to give a summary of the user's history.

5.  **`search_past_lessons` tool:** This simulates a memory search by reading from the persistent `user:topics_covered` state.

6.  **Agent `instruction`:** Notice how the prompt reads the `app:course_version` to announce which version of the course it is running.

### Step 3: Run and Test the State Scopes

1.  **Set up your API key** in the `.env` file.

2.  **Start the Dev UI:**
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "personal_tutor".
    *   Go to the **State** tab. Set the global app state by entering the following and clicking "Set State":
        ```json
        {"app:course_version": "2.1"}
        ```
    *   Go back to the **Chat** tab and follow this script:

    **Session 1: Set Preferences and Learn**
    *   **User:** "Hi! Set my language to French and my difficulty to 'intermediate'."
        *   _(Agent calls `set_user_preferences` tool)_
    *   **User:** "I want to learn about Python decorators."
        *   _(Agent calls `start_learning_session` and explains the topic)_
    *   **User:** "Okay, I'm ready for the quiz. I got 9 out of 10."
        *   _(Agent calls `calculate_quiz_grade` and then `record_topic_completion`)_
    *   **Observe:** Go to the **State** tab. You will see `user:`, session (`current_topic`), and `temp:` state all populated.

    **Session 2: Verify Persistence**
    *   **Refresh the browser page** to start a new session.
    *   **Observe:** Go to the **State** tab. The session and `temp:` state are gone, but the `user:` state remains.
    *   **User:** "What's my progress so far?"
        *   _(Agent calls `get_user_progress` and correctly reports your completed topic and score from the previous session)_
    *   **User:** "Remind me what we covered about decorators."
        *   _(Agent calls `search_past_lessons` and finds the "Python decorators" topic from your user history)_

### Lab Summary

You have successfully built a sophisticated agent that leverages all four state scopes to provide a continuous, personalized experience. You have learned:
*   How to use `user:` state for persistent user preferences.
*   How to use session state for conversation-specific context.
*   How to use `temp:` state for single-turn, intermediate data.
*   How to use `app:` state for global, application-wide data.
*   How these state mechanisms work together to create agents with memory.