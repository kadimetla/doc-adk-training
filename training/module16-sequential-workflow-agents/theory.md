# Module 15: Sequential Workflows - Building Agent Pipelines

## Theory

### Beyond a Single Agent

Complex problems often require multiple steps or areas of expertise. Instead of creating one massive, monolithic agent, the ADK allows you to build **multi-agent systems** where several specialized agents collaborate.

For processes that follow a fixed, predictable sequence, the ADK provides the `SequentialAgent`.

### `SequentialAgent`: Building Pipelines

The `SequentialAgent` is a **Workflow Agent**, meaning it is not powered by an LLM. It is a deterministic controller that executes its `sub_agents` one after another, in the exact order they are defined. It's the foundation for creating multi-step pipelines where the output of one step becomes the input for the next.

**Key Concepts:**
*   **Execution Order:** Guaranteed to be top-to-bottom.
*   **Shared State:** The `SequentialAgent` passes the *same* session state to each sub-agent. This is how you pass data between steps.
*   **Data Flow with `output_key`:** An agent can define an `output_key` in its configuration. When it finishes, the ADK automatically saves its response to `state['your_key']`. The next agent in the sequence can then read this value by using `{your_key}` in its instruction prompt.

**When to Use `SequentialAgent`:**
*   When tasks MUST happen in a specific order.
*   When each step depends on the previous step's output.
*   When you need predictable, deterministic execution.
*   For building pipelines (e.g., ETL, content creation, review processes).