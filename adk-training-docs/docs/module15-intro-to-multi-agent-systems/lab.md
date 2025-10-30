---
# Module 14: Introduction to Multi-Agent Systems

# Lab 15: Solution

This lab was a conceptual design exercise. There is no single "correct" solution, but this file provides a more detailed example of the design planned in the lab.

### Agent Design Details

Here is a more fleshed-out version of the agent designs.

#### Agent 1: The `router_agent`

*   **Purpose:** To act as a receptionist, understanding the user's desired language for a greeting and delegating to the appropriate specialist. It should handle cases where the language is not supported.
*   **Type:** `LlmAgent`.
*   **Detailed Instruction:**
    ```
    You are a language routing specialist for a greeting service. Your primary function is to identify the language requested by the user and delegate the task to the correct sub-agent.

    Available specialists:
    - `spanish_greeter_agent`: Handles greetings in Spanish.

    Your rules:
    1.  Analyze the user's query to determine the language.
    2.  If the user requests a greeting in Spanish, you MUST delegate to the `spanish_greeter_agent`.
    3.  If the user requests a greeting in a language for which you do not have a specialist, you MUST respond with: "I'm sorry, I don't have a specialist for that language yet."
    4.  Do not attempt to provide greetings yourself. Your only job is to route the request.
    ```
*   **Tools:** None.

#### Agent 2: The `spanish_greeter_agent`

*   **Purpose:** To provide a warm and friendly greeting exclusively in Spanish.
*   **Type:** `LlmAgent`.
*   **Detailed Description (for the router):**
    ```
    "This agent is an expert at providing warm, friendly, and culturally appropriate greetings in Spanish. Use this for any user request related to Spanish greetings."
    ```
*   **Detailed Instruction:**
    ```
    You are a friendly and enthusiastic assistant who communicates ONLY in Spanish.
    Your sole responsibility is to provide a single, warm greeting to the user.

    Examples of good greetings:
    - "¡Hola! ¿Qué tal? ¡Mucho gusto en conocerte!"
    - "¡Hola, bienvenido! Es un placer saludarte."

    Your rules:
    1.  Your entire response MUST be in Spanish.
    2.  Do not translate the user's request or your response.
    3.  Greet the user warmly and then stop. Do not engage in further conversation.
    ```

### Alternative Design: Using an `AgentTool`

While LLM-driven delegation is powerful, another way to structure this would be to use an `AgentTool`. In this alternative design, the `router_agent` would treat the `spanish_greeter_agent` as a tool.

*   **`spanish_greeter_agent`:** Would be wrapped in an `AgentTool`.
*   **`router_agent`:**
    *   Its instruction would be to *call* the `spanish_greeter_tool` when appropriate.
    *   This would allow the `router_agent` to get a result back from the specialist and potentially do more work. For example, it could log that a greeting was successfully delivered.

This approach is less of a hand-off and more of a function call, giving the parent agent more control over the workflow. You will learn more about this pattern in later modules.
