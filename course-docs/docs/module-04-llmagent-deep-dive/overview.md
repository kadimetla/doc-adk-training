
---
title: LlmAgent Deep Dive
---

## Module 4: Core Agent Concepts: `LlmAgent` Deep Dive

## Overview

### The Art of the Instruction

The **`instruction`** parameter is where you truly shape your agent's behavior. A well-crafted instruction tells the agent:

*   **Its Persona:** How should it behave?
*   **Its Core Goal:** What is its primary function?
*   **Its Constraints:** What should it *not* do?
*   **Its Process:** How should it perform a task?
*   **Its Output Format:** How should it format its responses?

### Tips for Effective Instructions

*   **Be Clear and Specific:** Ambiguity leads to unreliable behavior.
*   **Use Simple Language:** Write instructions as if you were talking to a person.
*   **Provide Examples (Few-Shot Prompting):** This is a powerful technique to guide the agent.
    ```yaml
    instruction: |
      You are a translator.
      Example User Input: "Hello"
      Example Agent Output: "Bonjour"
    ```
*   **Iterate and Refine:** Test and refine your instructions based on the agent's responses.
