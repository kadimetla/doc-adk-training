# Module 17: Multi-Agent Systems - Complex Orchestration

## Theory

### Combining Workflows for Complex Systems

You have learned how to create sequential pipelines and parallel task forces. The true power of multi-agent systems comes from **combining these patterns** to orchestrate sophisticated, real-world workflows. By nesting `SequentialAgent` and `ParallelAgent` instances, you can design agent architectures that mirror complex business processes.

### Common Multi-Agent Patterns

#### 1. Fan-Out/Gather (Parallel inside Sequential)

This is the most common and powerful pattern, which you built in the previous module. It is ideal for tasks that require gathering information from multiple independent sources and then synthesizing it.

*   **Structure:** A `SequentialAgent` contains a `ParallelAgent` (the "fan-out" phase) followed by one or more `LlmAgent`s (the "gather" phase).
*   **Use Case:** Building a trip planner that concurrently fetches flights, hotels, and activities, and then uses a final agent to assemble the itinerary.

```
       ┌─ Agent A (Flights) ─┐
User ──┼─ Agent B (Hotels)  ──┼─→ Merger Agent → Final Result
       └─ Agent C (Activities)─┘

     ParallelAgent (fast!)       SequentialAgent (combine)
```

#### 2. Nested Sequential Pipelines (Sequential inside Parallel)

This pattern is useful when you have several independent, multi-step processes that can all run at the same time.

*   **Structure:** A `ParallelAgent` contains multiple `SequentialAgent` instances.
*   **Use Case:** A content publishing system that needs to generate three different types of articles (e.g., a news summary, a social media trend report, and an expert opinion piece). Each article type has its own sequential pipeline (e.g., Research -> Draft -> Edit), and all three pipelines can run concurrently.

```
       ┌─ Sequential: A → B ─┐
User ──┼─ Sequential: C → D ─┼─→ Final Output (Separate Results)
       └─ Sequential: E → F ─┘

     Parallel Container
```

### Real-World Research with the `google_search` Tool

To make our agents truly powerful, they need access to up-to-date, real-world information. The ADK provides a built-in `google_search` tool that works seamlessly with Gemini models.

When you include `google_search` in an agent's `tools` list, you give it the ability to perform web searches to answer questions, find current events, or gather any information it needs to complete its task. This transforms your agents from relying solely on their training data to being able to reason with current information from the web.