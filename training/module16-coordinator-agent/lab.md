# Module 16: Building a Coordinator/Dispatcher Agent

## Lab 16: Implementing the "Greeting Router"

### Goal

In this lab, you will implement the multi-agent "Greeting Router" system. You will create a main router agent and a specialist `spanish_greeter` agent, and configure them to work together using the coordinator/dispatcher pattern.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create --type=config greeting-agent
    cd greeting-agent
    ```

### Step 2: Create the Specialist Agent

**Exercise:** Create a new file named `spanish_greeter.yaml`. In this file, use the skeleton below to define the configuration for the `spanish_greeter_agent`.

```yaml
# In spanish_greeter.yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: spanish_greeter_agent
model: gemini-2.5-flash
description: |
  # TODO: Write a clear description that explains this agent's capability
  # (e.g., "An expert at providing friendly greetings in Spanish.").
  # This is critical for the router to find it.
instruction: |
  # TODO: Write an instruction that tells the agent its only job is to
  # provide a warm greeting in Spanish.
```

### Step 3: Configure the Coordinator (Router) Agent

**Exercise:** Now, open the main `root_agent.yaml` file and use the skeleton below to configure it to act as the router.

```yaml
# In root_agent.yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: router_agent
model: gemini-2.5-flash
description: The main greeter agent that routes to language specialists.
instruction: |
  # TODO: Write an instruction that tells the agent its job is to delegate
  # to the `spanish_greeter_agent` for Spanish greetings and that it
  # should *not* greet the user itself.

# TODO: Add the `sub_agents` section and use `config_path` to link to your
# `spanish_greeter.yaml` file.
sub_agents:
  - config_path: ...
```

### Step 4: Test the Multi-Agent System

1.  **Set up your `.env` file.**
2.  **Navigate to the parent directory** (`cd ..`) and start the Dev UI:
    ```shell
    adk web greeting-agent
    ```
3.  **Interact with the router:**
    *   **Test Case 1:** "Say hello to me in Spanish."
    *   **Test Case 2:** "Say hello in French."
4.  **Examine the Trace:** For the first test case, you should see the `router_agent` run, call `transfer_to_agent`, and then the `spanish_greeter_agent` run to produce the final output. For the second case, the router should respond itself that it cannot handle the request.

### Having Trouble?

If you get stuck, you can find the complete, working YAML configurations in the `lab-solution.md` file.

### Lab Summary

You have successfully built your first multi-agent system! You have learned to:
*   Create separate YAML configuration files for different agents.
*   Use the `sub_agents` and `config_path` keys to establish a parent-child hierarchy.
*   Write a clear `description` for a specialist agent so the coordinator can understand its function.
*   Write an `instruction` for a coordinator agent that tells it how to delegate tasks.
*   Verify the agent transfer process by inspecting the Trace View.

### Self-Reflection Questions
- What do you think would happen if you forgot to add the `description` to the `spanish_greeter.yaml` file? How would the `router_agent` behave?
- In the `router_agent`'s instruction, why is it important to explicitly tell it *not* to greet the user itself?
- How does breaking the logic into a router and a specialist make the system easier to extend in the future (e.g., to add a `french_greeter_agent`)?