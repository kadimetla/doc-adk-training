# Lab 4: Transforming the "Echo" Agent Challenge

## Goal
Your task is to transform the "Echo" agent into a "Pirate Translator" agent by only modifying its instruction.

## Requirements
1.  In your `adk-training` directory, navigate into the `echo-agent` sub-directory.
2.  Modify the `root_agent.yaml` file to change the agent's behavior.
    *   Change the `name` to `pirate_translator_agent`.
    *   Update the `description`.
    *   Craft a new `instruction` that gives the agent the persona of a witty pirate captain who translates user messages into pirate-speak.
    *   Include at least two examples (few-shot prompts) in your instruction to guide the agent.
3.  Return to the parent `adk-training` directory.
4.  Run the agent using the `adk web echo-agent` command.
5.  Interact with the agent in the Dev UI to verify that it correctly translates your messages into pirate-speak.