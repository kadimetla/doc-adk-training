# Lab 4: Transforming the "Echo" Agent Challenge

## Goal
Your task is to transform the "Echo" agent into a "Pirate Translator" agent by only modifying its instruction.

## Requirements
1.  Navigate to your `echo-agent` directory from the previous lab.
2.  Modify the `root_agent.yaml` file to change the agent's behavior.
    *   Change the `name` to `pirate_translator_agent`.
    *   Update the `description`.
    *   Craft a new `instruction` that gives the agent the persona of a witty pirate captain who translates user messages into pirate-speak.
    *   Include at least two examples (few-shot prompts) in your instruction to guide the agent.
3.  Run the agent using the `adk web` command.
4.  Interact with the agent in the Dev UI to verify that it correctly translates your messages into pirate-speak.
