# Module 34: Agent-to-Agent Communication

## Lab 34: Building a Distributed Research System

### Goal

In this lab, you will build a distributed multi-agent system. You will create a main **Orchestrator** agent and a separate, standalone **Research Specialist** agent. The Orchestrator will delegate tasks to the Research Specialist over the network using the ADK's A2A capabilities.

### Step 1: Create the Project Structure

For this lab, we need two separate agent projects that will run independently.

1.  **Navigate to your training directory.**
2.  **Create the Orchestrator project:**
    ```shell
    adk create a2a-orchestrator
    ```
    Choose the **Programmatic (Python script)** option.

3.  **Create the Research Specialist project:**
    ```shell
    adk create research-specialist
    ```
    Choose the **Programmatic (Python script)** option.

### Step 2: Build the Research Specialist (The Server)

First, we'll build the remote agent that will provide the research service.

1.  **Navigate into the specialist's directory:**
    ```shell
    cd research-specialist
    ```

2.  **Configure the environment:**
    *   Set up your `.env` file for **Vertex AI**, as the `google_search` tool requires it.

3.  **Implement the agent:**
    **Exercise:** Open `agent.py` and replace its contents with the code from the `lab-solution.md` file under the `research-specialist/agent.py` heading.

    **Key things to study:**
    *   The `root_agent` is a standard `LlmAgent` with the `google_search` tool.
    *   The crucial line is `a2a_app = to_a2a(root_agent, port=8001)`. This wraps your agent in a web application that speaks the A2A protocol.

### Step 3: Build the Orchestrator (The Client)

Now, let's build the main agent that will consume the remote service.

1.  **Navigate into the orchestrator's directory:**
    ```shell
    cd ../a2a-orchestrator
    ```

2.  **Configure the environment:**
    *   Set up your `.env` file with your API key or Vertex AI project.

3.  **Implement the agent:**
    **Exercise:** Open `agent.py` and replace its contents with the code from the `lab-solution.md` file under the `a2a-orchestrator/agent.py` heading.

    **Key things to study:**
    *   `RemoteA2aAgent`: This class is used to create a proxy for our remote agent.
    *   `agent_card`: We provide the URL to the remote agent's auto-generated agent card. The ADK uses this to discover and connect to the specialist.
    *   `sub_agents`: The `remote_researcher` is treated just like any other sub-agent, making the orchestration logic simple.

### Step 4: Run and Test the Distributed System

This requires two separate terminals.

1.  **Terminal 1: Start the Research Specialist Server**
    *   Navigate to the `research-specialist` directory.
    *   Use `uvicorn` to run the A2A server.

    ```shell
    cd /path/to/your/training/research-specialist
    uvicorn agent:a2a_app --host localhost --port 8001
    ```
    You should see the server start up.

2.  **Terminal 2: Start the Orchestrator Client**
    *   Navigate to the `a2a-orchestrator` directory.
    *   Run the `adk web` server as usual.

    ```shell
    cd /path/to/your/training/a2a-orchestrator
    adk web
    ```

3.  **Interact with the System:**
    *   Open the Dev UI for the orchestrator (`http://localhost:8080`).
    *   Give it a research task.
        *   **User:** "Please research the latest news on AI-powered drug discovery."
    *   **Observe the Trace:** In the Trace View, you will see the `orchestrator_agent` run. It will then call the `remote_researcher` sub-agent. This confirms that the main agent successfully delegated the task to the remote specialist over the network.

### Lab Summary

You have successfully built a distributed multi-agent system! This is a powerful architecture for creating scalable and modular AI applications.

You have learned to:
*   Expose an ADK agent as a network service using the `to_a2a()` utility and `uvicorn`.
*   Connect to a remote agent from an orchestrator using the `RemoteA2aAgent` class.
*   Understand how agent discovery works via the `agent-card.json` file.
*   Orchestrate tasks between agents running in separate processes.
