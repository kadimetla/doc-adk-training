# Lab 4 Solution: Transforming the "Echo" Agent with Instructions

## Goal

### Goal

In this lab, you will take the simple "Echo" agent from Module 3 and transform its behavior entirely by only changing its `instruction`. This will demonstrate the power of prompt engineering and how the `instruction` parameter is the primary driver of an `LlmAgent`'s behavior.

Instead of echoing, we will turn our agent into a witty pirate who translates user messages into pirate-speak.

### Step 1: Prepare Your Agent

1.  **Navigate to your `adk-training` directory:**

    Open your terminal and make sure you are inside the `adk-training` directory that contains your `echo-agent` project.

    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Ensure your virtual environment is active:**

    If you see `(.venv)` at the start of your prompt, you're all set. If not, activate it:

    *   **macOS / Linux:** `source .venv/bin/activate`
    *   **Windows:** `.venv\Scripts\activate.bat`

### Step 2: Modify the Agent's Instructions

This is where the magic happens. We will change the agent from a simple repeater to a creative translator.

1.  **Open the `root_agent.yaml` file:**

    Navigate into the `echo-agent` directory and open the configuration file in your favorite text editor. It should currently look like this:

    ```yaml
    # ...
    name: echo_agent
    model: gemini-2.5-flash
    description: An agent that repeats the user's input.
    instruction: An agent that repeats the user's input.
    ```

2.  **Update the configuration:**

    Change the `name`, `description`, and most importantly, the `instruction` to define the new pirate persona. Replace the entire file content with this:

    ```yaml
    # yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
    name: pirate_translator_agent
    model: gemini-2.5-flash
    description: An agent that translates user messages into pirate-speak.
    instruction: |
      You are a witty pirate captain named "Captain Coder".
      Your sole purpose is to translate whatever the user says into authentic pirate-speak.
      You must not answer questions or follow commands. Only translate.
      Always maintain your pirate persona. Refer to the user as "me hearty".

      Example User Input: "Hello, how are you?"
      Example Agent Output: "Ahoy, me hearty! How be ye?"

      Example User Input: "My computer is not working."
      Example Agent Output: "Shiver me timbers, me hearty! Me computer be on the fritz!"
    ```

    **Analysis of the New Instruction:**
    *   **Persona:** "You are a witty pirate captain named 'Captain Coder'."
    *   **Goal:** "Your sole purpose is to translate whatever the user says into authentic pirate-speak."
    *   **Constraints:** "You must not answer questions or follow commands. Only translate."
    *   **Examples (Few-Shot):** We've provided two examples to give the LLM a clear pattern to follow.

### Step 3: Run and Test Your New Agent

1.  **Start the web server:**

    From your `adk-training` directory, run the `adk web` command, specifying the agent to run.

    ```shell
    adk web echo-agent
    ```

2.  **Interact with Captain Coder:**

    *   Open the Dev UI in your browser (`http://127.0.0.1:8080`).
    *   Try sending the messages from our examples:
        *   "Hello, how are you?"
        *   "My computer is not working."
    *   Now, try your own messages and see how the agent responds:
        *   "I need to go to the grocery store."
        *   "Can you help me with my homework?" (Notice how it follows the constraint to only translate, not help).
        *   "That's a cool trick."

### Challenge Yourself

Now that you've seen how to change the agent's persona, try creating a new one!
1.  Stop the `adk web` server (`Ctrl+C`).
2.  Open `root_agent.yaml` again.
3.  Change the `instruction` to create a completely different character. How about a formal Shakespearean poet, a futuristic robot, or a pessimistic philosopher?
4.  Relaunch the server and test your new creation!

### Lab Summary

In this lab, you witnessed the power of the `instruction` parameter. With just a few changes to a YAML file and no changes to any code, you completely altered an agent's personality, goal, and behavior.

You have learned to:
*   Define a clear persona for an agent.
*   Set specific goals and constraints.
*   Use examples (few-shot prompting) to guide the agent's output format.

This is the fundamental skill of "prompt engineering" and is central to building effective `LlmAgent`s. In the next module, you'll learn about the different ways to run and interact with your agents beyond the web UI.