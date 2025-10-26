# Module 27: Advanced Observability with Plugins

## Lab 27: Building an Observability System with Plugins

### Goal

In this lab, you will build a comprehensive, production-grade observability system for an agent using the ADK's **Plugin System**. You will implement separate plugins for metrics collection, alerting, and performance profiling, demonstrating a powerful, modular approach to monitoring.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    ```shell
    adk create observability-agent
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd observability-agent
    ```

### Step 2: Implement the Observability Plugins

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and understand how the plugin-based architecture works:

1.  **`BasePlugin`:** Notice that all three plugins (`MetricsCollectorPlugin`, `AlertingPlugin`, `PerformanceProfilerPlugin`) inherit from `BasePlugin`.

2.  **`on_event_callback`:** This is the core method for every plugin. The ADK runner calls this method for every event, passing the `event` object to each registered plugin.

3.  **`MetricsCollectorPlugin`:**
    *   This plugin watches for `request_start` and `request_complete` events.
    *   It uses these events to calculate latency and track aggregate metrics like total requests, success rate, and average latency.

4.  **`AlertingPlugin`:**
    *   This plugin watches for `request_error` events.
    *   It maintains a `consecutive_errors` counter and prints a `[CRITICAL ALERT]` if the count exceeds a threshold, simulating an alert that could be sent to an on-call engineer.

5.  **`PerformanceProfilerPlugin`:**
    *   This plugin watches for `tool_call_start` and `tool_call_complete` events.
    *   It uses the timestamps of these events to precisely measure the duration of each tool call, helping to identify performance bottlenecks.

6.  **Registering Plugins:**
    *   At the bottom of the file, in the `main` block, see how the plugins are instantiated and passed to the `InMemoryRunner` in a list: `plugins=[metrics_plugin, alerting_plugin, profiler_plugin]`.

### Step 3: Run and Test the Plugin System

1.  **Set up your `.env` file** with your API key or Vertex AI project.

2.  **Run the agent with the Dev UI:**
    The solution file is designed to be run with the web UI, and the plugins will print their output to the console where `adk web` is running.

    ```shell
    adk web
    ```

3.  **Interact with the Agent and Observe the Console:**
    *   Open the Dev UI (`http://localhost:8080`).
    *   Send a few successful prompts to the agent, such as "Hello, how are you?"
    *   **Check the console where `adk web` is running.** You will see the output from your plugins:
        *   `[METRICS]` logs showing the start and completion of requests.
        *   `[PROFILER]` logs showing the start and completion of any tool calls the agent makes.
    *   Now, trigger an error (e.g., by asking it to use a tool with invalid arguments if you have one, or by simulating an error). You will see the `[ALERT]` log from the `AlertingPlugin`.

### Lab Summary

You have successfully built a modular, enterprise-grade observability system using the ADK's Plugin System. This separates your monitoring logic from your agent's business logic, making both easier to maintain and scale.

You have learned to:
*   Create custom plugins by inheriting from `BasePlugin`.
*   Implement the `on_event_callback` method to intercept and process agent events.
*   Filter events based on their `event_type` to implement specific logic (metrics, alerts, etc.).
*   Register plugins with the `InMemoryRunner`.
*   Observe the output of multiple, independent plugins running as part of the agent's execution lifecycle.
