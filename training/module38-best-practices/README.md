---
sidebar_position: 1
title: "Module 38: Best Practices & Production Patterns"
---

# Module 38: Best Practices & Production Patterns

## Theory

### From Prototype to Production

Building a working agent is the first step. Building a **production-ready** agent requires a focus on architecture, performance, security, and reliability. This module summarizes the essential best practices for taking your agent from a prototype to a robust, scalable, and maintainable application.

### 1. Architectural Best Practices

*   **Small, Focused Tools:** Design your tools to follow the single-responsibility principle. A tool should do one thing well. This makes them easier to test, debug, and for the LLM to reason about.
*   **Clear, Structured Instructions:** Your agent's `instruction` is its constitution. Use clear language, define a specific persona and goal, and provide examples (few-shot prompting) to guide its behavior.
*   **Separate Logic from Configuration:** Use Python-based agents (`agent.py`) for any agent that has tools or complex logic. Use YAML (`root_agent.yaml`) only for very simple, instruction-only agents.
*   **Use Multi-Agent Systems for Complexity:** Don't build monolithic agents. Break down complex problems into smaller, specialized agents and orchestrate them with a Coordinator, `SequentialAgent`, or `LoopAgent`.

### 2. Performance Optimization

*   **Model Selection:** Choose the right model for the job. Use cheaper, faster models (like `gemini-1.5-flash`) for simple tasks like classification or routing, and more powerful models (`gemini-1.5-pro`) for complex reasoning.
*   **Token Usage:** Keep instructions concise and clear old conversation history periodically to manage the context window. Use `max_output_tokens` to prevent unnecessarily long and expensive responses.
*   **Caching:** Cache the results of expensive or frequently called tool functions, especially those that call external APIs.
*   **Parallelism:** Use a `ParallelAgent` for independent, non-sequential tasks to significantly reduce overall latency.

### 3. Security Best Practices

*   **Input Validation:** Never trust user input. Validate and sanitize all inputs in your tool functions to prevent injection attacks (e.g., SQL injection, XSS).
*   **Secrets Management:** **Never** hardcode API keys or other secrets in your code. Use a `.env` file for local development and a secure secret manager (like Google Secret Manager) in production.
*   **Authentication & Authorization:** Secure your agent's API endpoints. Use the authentication provided by your deployment platform (e.g., Cloud Run IAM) or implement your own middleware.
*   **Human-in-the-Loop (HITL):** For tools that perform destructive or sensitive actions, implement an approval workflow using `before_tool_callback` to require human confirmation.

### 4. Error Handling & Resilience

*   **Comprehensive Error Handling:** Your tool functions should have robust `try...except` blocks to catch errors and return a structured error message to the agent.
*   **Retries with Exponential Backoff:** For tools that call external APIs that might fail intermittently, implement a retry mechanism with exponential backoff.
*   **Circuit Breaker Pattern:** To prevent a failing external service from causing cascading failures in your system, use a circuit breaker that temporarily stops calls to the failing service.
*   **Graceful Degradation:** Design your agent to provide a useful, albeit limited, response even if one of its tools fails. For example, a product recommendation agent could fall back to showing "popular items" if the personalization service is down.

### Key Takeaways
- **Architecture:** Build modular systems with small, focused tools and specialized agents.
- **Performance:** Optimize by selecting the right model, managing token usage, caching results, and using parallelism.
- **Security:** Always validate inputs, manage secrets securely, implement authentication, and use Human-in-the-Loop for sensitive operations.
- **Resilience:** Build robust error handling into your tools, use retries for flaky APIs, and design for graceful degradation.
- **Pydantic for Input Validation:** Using a schema validation library like Pydantic for input validation offers significant advantages over manual `if/else` checks. It enforces a rigid schema, enhancing **security** by preventing injection attacks and DoS from malformed payloads. It improves **readability and maintainability** by centralizing validation logic declaratively. Furthermore, Pydantic generates **structured error messages**, which are easily parsable for robust error handling.
- **Production Error Handling:** Beyond simple connection errors, production-grade tools should gracefully handle various error types by returning structured error messages to the LLM. These include **API/Response Errors** (e.g., HTTP 4xx/5xx status codes), **Data Format Errors** (e.g., malformed JSON, missing keys), **Business Logic Errors** (e.g., timeouts, invalid input leading to logical failures), and **Permission/Authentication Errors** (e.g., expired credentials). Robust error handling prevents crashes and allows the agent to respond intelligently to failures.
- **`@lru_cache` Limitations in Cloud Run:** While `@lru_cache` is useful for local caching, it's not suitable for distributed, multi-instance deployments like Cloud Run. The cache is in-memory for a single process, meaning data is lost if the instance scales to zero or is recycled, and multiple instances will have unsynchronized caches. A better solution for production is a centralized, external caching service like Google Cloud Memorystore (Redis) or a database for more persistent data.