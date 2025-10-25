# Module 18: Iterative Refinement with Loop Agents

## Lab 18: Building an Essay Refinement System

### Goal

In this lab, you will build a self-improving agent system that uses a `LoopAgent` to iteratively refine an essay. This will demonstrate the powerful "Critic -> Refiner" pattern for achieving high-quality results.

### The Architecture

1.  **Initial Writer:** A single `LlmAgent` runs once to create the first draft of an essay.
2.  **Refinement Loop:** A `LoopAgent` then runs for a maximum of 5 iterations. In each loop:
    *   **Critic Agent:** Evaluates the current essay draft and provides specific feedback for improvement, or an "APPROVED" message if it's good enough.
    *   **Refiner Agent:** Reads the critique. If it's "APPROVED", it calls an `exit_loop` tool to terminate the process. Otherwise, it applies the feedback to create a better version of the essay, overwriting the previous draft in the state.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create essay-refiner
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd essay-refiner
    ```

### Step 2: Build the Loop-Based Refiner

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and understand its key components:

1.  **`exit_loop` Tool:**
    *   This is a simple function tool. Notice the critical line: `tool_context.actions.end_of_agent = True`. This is the signal that tells the parent `LoopAgent` to stop iterating.

2.  **`initial_writer` Agent:**
    *   A standard `LlmAgent` that runs once and saves its output to the `current_essay` state key.

3.  **`critic` Agent:**
    *   This agent's instruction is key. It has a conditional prompt: IF the essay is good, it MUST output the exact phrase "APPROVED - Essay is complete.". OTHERWISE, it must provide feedback.

4.  **`refiner` Agent:**
    *   This agent also has a conditional instruction. IF it sees the "APPROVED" message in the `{critique}` state variable, it MUST call the `exit_loop` tool. OTHERWISE, it rewrites the essay.
    *   Notice its `output_key` is also `current_essay`. This is the **state overwriting pattern**, where each iteration replaces the old draft with the newly improved one.

5.  **`refinement_loop` (`LoopAgent`):**
    *   This agent orchestrates the Critic and Refiner.
    *   It has `max_iterations=5` set as a safety net.

6.  **`essay_refinement_system` (`SequentialAgent`):**
    *   The root agent that runs the `initial_writer` once, followed by the `refinement_loop`.

### Step 3: Run and Test the System

1.  **Set up your API key** in the `.env` file.

2.  **Navigate to the parent directory** and start the Dev UI:
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the system:**
    *   Open `http://localhost:8080` and select "essay_refiner".
    *   Give the system a topic for an essay.

    **Try these prompts:**
    *   "Write an essay about the importance of education"
    *   "Write an essay arguing for renewable energy adoption"

4.  **Analyze the Trace View:**
    *   This is the most important part of the lab. Expand the trace to see the `SequentialAgent` run the `InitialWriter`.
    *   Then, expand the `RefinementLoop`. You will see multiple "Iterations".
    *   Inside each iteration, you can see the `Critic` run, followed by the `Refiner`.
    *   Observe how the `current_essay` in the state changes and improves with each iteration.
    *   Find the final iteration where the `Refiner` calls the `exit_loop` tool, causing the loop to terminate.

### Lab Summary

You have successfully built a self-correcting system using a `LoopAgent`. You have learned:
*   How to implement the "Critic -> Refiner" pattern for iterative improvement.
*   How to use `max_iterations` as a safety net.
*   How to create and use an `exit_loop` tool with `tool_context.actions.end_of_agent = True` for smart loop termination.
*   How to use state overwriting to refine a piece of data over multiple iterations.