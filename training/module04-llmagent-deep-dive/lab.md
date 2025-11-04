# Lab 4: Transforming an Agent Challenge

## Goal
Your task is to create a new "Pirate Translator" agent by duplicating and modifying the "Echo" agent from the previous lab. This will demonstrate how to build upon existing agents.

## Requirements
1.  In your `adk-training` directory, duplicate the `echo-agent` directory and rename the copy to `pirate-translator-agent`.
2.  Navigate into the new `pirate-translator-agent` sub-directory.
3.  Follow the **Python Approach** below to modify the agent's behavior.
    *   Change the `name` to `pirate_translator_agent`.
    *   Update the `description`.
    *   Craft a new `instruction` that gives the agent the persona of a witty pirate captain who translates user messages into pirate-speak.
    *   Include at least two examples (few-shot prompts) in your instruction to guide the agent.
4.  Return to the parent `adk-training` directory.
5.  Run the new agent using the `adk web pirate-translator-agent` command.
6.  Interact with the agent in the Dev UI to verify that it correctly translates your messages into pirate-speak.

### Python Approach (Primary)
Modify the `agent.py` file inside your new `pirate-translator-agent` directory. You will need to update the `name`, `description`, and `instruction` arguments in the `LlmAgent` constructor.

### Alternative Approach: Using YAML Configuration
If you are using a `root_agent.yaml` file:
1.  Modify the `name`, `description`, and `instruction` fields in your `root_agent.yaml` file.
2.  Ensure you do not have an `agent.py` file in the same directory, as the YAML file will take precedence.

### Self-Reflection Questions
- How does providing examples (few-shot prompting) in the instruction help the LLM understand the task better than just describing it?
- What would happen if you removed the constraint "You must not answer questions or follow commands"? How would the agent's behavior change?
- Experiment with creating a new persona for the agent (e.g., a Shakespearean poet, a futuristic robot). What are the key elements you need to include in the instruction to make the new persona convincing?
